import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { indexOf, isEmpty, map } from 'lodash';
import { Observable, Subscription, Subject } from 'rxjs/Rx';

import { GlobalService } from './../../../shared';

import { Answer } from './../../../model/answer';
import { Problem } from './../../../model/problem';

declare var Metronic: any;
declare const navigator: any;
declare const MediaRecorder: any;

@Component({
  selector: 'app-qa',
  template: require('./qa.component.html'),
  styles: [`${require('./qa.component.css')}`]
})

export class QAComponent implements OnInit {
  private _quiz: Problem;
  private _started: boolean;
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

  get started(): boolean {
    return this._started;
  }
  @Input() set started(started: boolean) {
    if (started) this.startQA();
    else this.exitQA();
  }

  @Input() prevQuiz: Problem;
  @Input() nextQuiz: Problem;

  @Output() goToPrev = new EventEmitter<Problem>();
  @Output() goToNext = new EventEmitter<Problem>();
  @Output() exit = new EventEmitter<Problem>();
  @Output() onUpdateStep = new EventEmitter<string>();
  @Output() onUpdateElapsedTime = new EventEmitter<number>();

  step: string;
  steps: string[];
  elapsedTime: number = 0;
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
        if (this.started && this.elapsedTime > 0) {
          this.updateElapsedTime(this.elapsedTime - 1);
          if (this.elapsedTime === 0) this.goToNextStep();
        }
      });
  }

  stopTimer() {
    this.subject.next(true);
  }

  private onChangeQuiz(quiz: Problem) {
    let { preparation_time, limit_time, id, content } = quiz;

    this._quiz = quiz;
    this.steps = this.globalService.getSteps(quiz.type);
    this.showSolution = false;
    this.started = false;
    this.updateElapsedTime(quiz.preparation_time);
    this.updateStep('');
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

    this.stopTimer();

    let { preparation_time, limit_time, id } = this._quiz;

    switch (step) {
      case this.globalService.STEP_LISTENING:
        this.updateStep(step);
        return;

      case this.globalService.STEP_MAIN:
        this.updateElapsedTime(limit_time);
        this.updateStep(step);
        this.initAnswer();
        this.startTimer();
        return;

      case this.globalService.STEP_POST:
        this.endTime = +new Date();
        this.saveAnswer(this.answer, () => {
          this.updateStep(step);
        });
        return;

      case this.globalService.STEP_PRE:
        this.updateElapsedTime(preparation_time);
        this.updateStep(step);
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

  startQA() {
    this._started = true;
    this.goToPreStep();
  }

  exitQA() {
    this._started = false;
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
    if (this.mediaRecorder) {
      this.mediaRecorder.start();
    } else {
      alert('Please enable mic!');
    }
  }

  stopRecord() {
    if (this.mediaRecorder) this.mediaRecorder.stop();
  }

  updateStep(step: string) {
    this.step = step;
    this.onUpdateStep.emit(this.step);
  }

  updateElapsedTime(elapsedTime: number) {
    this.elapsedTime = elapsedTime;
    this.onUpdateElapsedTime.emit(this.elapsedTime);
  }
}
