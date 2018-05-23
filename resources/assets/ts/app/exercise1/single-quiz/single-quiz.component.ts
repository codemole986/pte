import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { indexOf, isEmpty, map } from 'lodash';
import { Observable, Subscription, Subject } from 'rxjs/Rx';

import { GlobalService } from './../../shared';

import { Answer } from './../../model/answer';
import { Problem } from './../../model/problem';

declare var Metronic: any;
declare var SC: any;

@Component({
  selector: 'app-exercise-single',
  template: require('./single-quiz.component.html'),
  styles: [`${require('./single-quiz.component.css')}`]
})

export class SingleQuizComponent implements OnInit {
  private _quiz: Problem;
  private scAudioPlayerId: string = 'sc-audio-player';
  private dingPeriod: number = 1000;
  private subject: Subject<boolean>;
  private startTime: number;
  private endTime: number;

  get quiz(): Problem {
    return this._quiz;
  }
  @Input() set quiz(quiz: Problem) {
    this.onChangeQuiz(quiz);
  }

  @Input() prevQuiz: Problem;
  @Input() nextQuiz: Problem;

  @Output() goToPrev = new EventEmitter<Problem>();
  @Output() goToNext = new EventEmitter<Problem>();
  @Output() exit = new EventEmitter<Problem>();

  step: string;
  steps: string[];
  started: boolean = false;
  remainingTime: number = 0;
  showSolution: boolean = false;
  answer: Answer;

  constructor(
    private http: Http,
    private globalService: GlobalService,
    private translate: TranslateService
  ) {
    this.subject = new Subject();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  startTimer() {
    Observable.timer(1000, 1000)
      .takeUntil(this.subject)
      .subscribe(t => {
        if (this.started && this.remainingTime > 0) {
          this.remainingTime --;
          if (this.remainingTime === 0) this.goToNextStep();
        }
      });
  }

  stopTimer() {
    this.subject.next(true);
  }

  private onChangeQuiz(quiz: Problem) {
    const { preparation_time, limit_time, id, content } = quiz;
    const { audio } = content;
    const patternIframe = new RegExp('^<iframe(.+)</iframe>$');
    const patternSrc = new RegExp('(?<=src=").*?(?=["])');
    const patternAutoPlay = new RegExp('auto_play=(true|false)');

    if (audio && patternIframe.test(audio)) {
      let src = '';
      const matches = audio.match(patternSrc);

      if (matches.length > 0) {
        src = matches[0].replace(patternAutoPlay, 'auto_play=true');
        quiz.content.audio = src;

        const _self = this;

        window.addEventListener('message', (event: MessageEvent) => {
          const { origin } = event;

          if (origin === 'https://w.soundcloud.com') {
            const scWidget = SC.Widget(_self.scAudioPlayerId);

            scWidget.bind(SC.Widget.Events.PLAY, () => {
              console.log('play');
            });

            scWidget.bind(SC.Widget.Events.FINISH, function(event: MessageEvent) {
              console.log('finish');
              _self.goToStep(_self.globalService.STEP_MAIN);
            });
          }
        });
      }
    }

    this._quiz = quiz;
    this.remainingTime = quiz.preparation_time;
    this.steps = this.globalService.getSteps(quiz.type);
    this.showSolution = false;
    this.started = false;
  }

  isPreStep(step: string): boolean {
    return step === this.globalService.STEP_PRE;
  }

  isMainStep(step: string): boolean {
    return step === this.globalService.STEP_MAIN;
  }

  isListeningStep(step: string): boolean {
    return step === this.globalService.STEP_LISTENING;
  }

  isPostStep(step: string): boolean {
    return step === this.globalService.STEP_POST;
  }

  goToPreStep() {
    this.step = this.globalService.STEP_PRE;
    this.goToStep(this.step);
  }

  goToMainStep() {
    this.step = this.globalService.STEP_MAIN;
    this.goToStep(this.step);
  }

  goToPostStep() {
    this.step = this.globalService.STEP_POST;
    this.goToStep(this.step);
  }

  goToNextStep() {
    if (isEmpty(this.steps)) return;

    const index = indexOf(this.steps, this.step);

    if (index < this.steps.length - 1) {
      this.goToStep(this.steps[index + 1]);
    }
  }

  goToPrevStep() {
    if (isEmpty(this.steps)) return;

    const index = indexOf(this.steps, this.step);

    if (index > 0) {
      this.goToStep(this.steps[index - 1]);
    }
  }

  goToStep(step: string) {
    if (isEmpty(this._quiz)) return;

    this.stopTimer();

    const { preparation_time, limit_time, id } = this._quiz;

    switch (step) {
      case this.globalService.STEP_LISTENING:
        this.step = step;
        return;
      case this.globalService.STEP_MAIN:
        this.playDingSound(() => {
          this.remainingTime = limit_time;
          this.step = step;
          this.initAnswer();
          this.startTimer();
        });
        return;
      case this.globalService.STEP_POST:
        this.endTime = +new Date();
        this.playDingSound(() => {
          this.saveAnswer(this.answer, () => {
            this.step = step;
          });
        });
        return;
      case this.globalService.STEP_PRE:
        this.remainingTime = preparation_time;
        this.step = step;
        this.startTimer();
        return;
      default:
        return;
    }
  }

  getTypes(category: string) {
    return this.globalService.problemTypes[category];
  }

  getTypeName(category: string, value: string) {
    const arr_types: { value: string, title: string }[] = this.getTypes(category);

    if(arr_types != null) {
      for (let i = 0;  i < arr_types.length; i++) {
        if (arr_types[i].value == value)
          return arr_types[i].title;
      }
    }

    return '';
  }

  toggleSolution() {
    this.showSolution = !this.showSolution;
  }

  startExercise() {
    this.started = true;
    this.goToPreStep();
  }

  restartExercise() {
    this.startExercise();
  }

  onExit(quiz: Problem) {
    this.exit.emit(quiz);
  }

  selectPrevQuiz(quiz: Problem) {
    this.goToPrev.emit(quiz);
  }

  selectNextQuiz(quiz: Problem) {
    this.goToNext.emit(quiz);
  }

  playDingSound(cb: Function) {
    const audio = new Audio();
    audio.src = this.globalService.dingSoundPath;
    audio.load();

    audio.addEventListener('canplaythrough', () => {
      audio.play();

      setTimeout(() => {
        audio.pause();
        cb();
      }, this.dingPeriod);
    }, false);
  }

  initAnswer() {
    this.startTime = +new Date();
    this.answer = new Answer;
    this.answer.testevent_id = 0;
    this.answer.quiz_id = this.quiz.id;
    this.answer.evaluate_mark = 0;
    this.answer.type = this.quiz.type;
    this.answer.answer = this.globalService.getSolutionObject(this.quiz.type);
  }

  updateAnswer(answer: any) {
    this.answer.answer = answer;
  }

  saveAnswer(answer: Answer, cb: Function) {
    this.http.post('/answer/insert', { ...answer, examine_uptime: (this.endTime - this.startTime) / 1000 })
      .map((response: Response) => response.json())
      .subscribe((data: { state: string, message: string }) => {
        if (data.state === 'error') Metronic.showErrMsg(data.message);
        if (cb) cb();
      });
  }
}
