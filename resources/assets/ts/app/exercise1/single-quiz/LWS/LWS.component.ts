import { Component, Input, Output, EventEmitter } from '@angular/core';
import { snakeCase, words } from 'lodash';

import { Problem } from './../../../model/problem';
import { Answer } from './../../../model/answer';
import { GlobalService } from './../../../shared';

@Component({
  selector: 'app-exercise-single-lws',
  template: require('./lws.component.html'),
  styles: [`${require('./lws.component.css')}`]
})

export class LWSComponent {
  private _step: string;
  private _quiz: Problem;

  get step(): string {
    return this._step;
  }
  @Input() set step(step: string) {
    this._step = step;

    if (this.isListeningStep(step)) {
      this.playAudio = true;
    } else {
      this.playAudio = false;
    }
  }
  get quiz(): Problem {
    return this._quiz;
  }
  @Input() set quiz(quiz: Problem) {
    this._quiz = quiz;
    this.playAudio = false;
  }

  @Output() updateAnswer = new EventEmitter<{ text: string }>();
  @Output() finishAudio = new EventEmitter<string>();

  count: number = 0;
  playAudio: boolean = false;

  constructor(
    private globalService: GlobalService
  ) {
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

  onChangeAnswerText(value: string) {
    this.count = words(value).length;
    this.updateAnswer.emit({ text: value });
  }

  onClickDownloadAnswerText(value: string) {
    this.globalService.downloadFile(value, `${snakeCase(this.quiz.title)}.txt`);
  }

  onFinish(song: any) {
    this.finishAudio.emit(this.globalService.STEP_MAIN);
  }
}
