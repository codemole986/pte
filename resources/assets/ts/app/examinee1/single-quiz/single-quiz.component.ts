import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { indexOf, isEmpty, map } from 'lodash';
import { Observable, Subscription, Subject } from 'rxjs/Rx';

import { GlobalService } from './../../shared';

import { Answer } from './../../model/answer';
import { Problem } from './../../model/problem';

declare var Metronic: any;
declare const navigator: any;
declare const MediaRecorder: any;

@Component({
  selector: 'app-examinee-single',
  template: require('./single-quiz.component.html'),
  styles: [`${require('./single-quiz.component.css')}`]
})

export class SingleQuizComponent implements OnInit {
  private _quiz: Problem;
  private dingPeriod: number = 1000;
  private subject: Subject<boolean>;
  private startTime: number;
  private endTime: number;
  private audioFinished: boolean = false;
  private mediaChunks: any = [];
  private mediaRecorder: any;

  get quiz(): Problem {
    return this._quiz;
  }
  @Input() set quiz(quiz: Problem) {
    this.onChangeQuiz(quiz);
  }

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
    let onSuccess = (stream: any) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.onstop = (e: any) => {
        let audio = new Audio();
        let blob = new Blob(this.mediaChunks, { 'type': 'audio/ogg; codecs=opus' });
        let formData = new FormData();
        formData.append('file', blob);
        this.mediaChunks.length = 0;
        this.http.post('/api/upload', formData)
          .map((response) => response.json())
          .subscribe(({ path }: { path: string }) => {
            console.log(path);
          });
      };

      this.mediaRecorder.ondataavailable = (e: any) => this.mediaChunks.push(e.data);
    };

    navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    navigator.getUserMedia({ audio: true }, onSuccess, (e: any) => console.log(e));
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
    let { preparation_time, limit_time, id, content } = quiz;
    let { audio } = content;
    let patternIframe = new RegExp('^<iframe(.+)</iframe>$');
    let patternSrc = new RegExp('(?<=src=").*?(?=["])');
    let patternAutoPlay = new RegExp('auto_play=(true|false)');
    let patternTrackId = new RegExp('\/tracks\/[1-9][0-9]*');

    if (audio && patternIframe.test(audio)) {
      let matches = audio.match(patternTrackId);
      let trackId = '';

      if (matches.length > 0) {
        trackId = matches[0].replace('/tracks/', '');
      }

      quiz.content.audio = trackId;
    }

    this._quiz = quiz;
    this.remainingTime = quiz.preparation_time;
    this.steps = this.globalService.getSteps(quiz.type);
    this.showSolution = false;
    this.started = false;
    this.step = '';
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
    this.goToStep(this.globalService.STEP_PRE);
  }

  goToMainStep() {
    this.goToStep(this.globalService.STEP_MAIN);
  }

  goToPostStep() {
    this.goToStep(this.globalService.STEP_POST);
  }

  goToNextStep() {
    if (isEmpty(this.steps)) return;

    let index = indexOf(this.steps, this.step);

    if (index < this.steps.length - 1) {
      this.goToStep(this.steps[index + 1]);
    }
  }

  goToPrevStep() {
    if (isEmpty(this.steps)) return;

    let index = indexOf(this.steps, this.step);

    if (index > 0) {
      this.goToStep(this.steps[index - 1]);
    }
  }

  goToStep(step: string) {
    if (isEmpty(this._quiz)) return;

    console.log(step);

    this.stopTimer();

    let { preparation_time, limit_time, id } = this._quiz;

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
            this.onExit(this.quiz);
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
    let arr_types: { value: string, title: string }[] = this.getTypes(category);

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

  onExit(quiz: Problem) {
    this.exit.emit(quiz);
  }

  playDingSound(cb: Function) {
    let audio = new Audio();
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

  onAudioFinished(step: string) {
    this.goToStep(step);
  }

  startRecord() {
    this.mediaRecorder.start();
  }

  stopRecord() {
    this.mediaRecorder.stop();
  }
}
