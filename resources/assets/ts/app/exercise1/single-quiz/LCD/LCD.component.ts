import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { includes, indexOf, map, remove, slice, words } from 'lodash';

import { Problem } from './../../../model/problem';
import { Answer } from './../../../model/answer';
import { GlobalService } from './../../../shared';

@Component({
  selector: 'app-exercise-single-lcd',
  template: require('./LCD.component.html'),
  styles: [`${require('./LCD.component.css')}`]
})

export class LCDComponent {
  private _step: string;
  private _quiz: Problem;

  get step(): string {
    return this._step;
  }
  @Input() set step(step: string) {
    this._step = step;

    if (this.isListeningStep(step) || this.isMainStep(step)) {
      this.playAudio = true;
    } else {
      this.playAudio = false;
    }
  }
  get quiz(): Problem {
    return this._quiz;
  }
  @Input() set quiz(quiz: Problem) {
    this.onChangeQuiz(quiz);
  }

  @Output() updateAnswer = new EventEmitter<{ optionno: number[] }>();
  @Output() finishAudio = new EventEmitter<string>();

  count: number = 0;
  playAudio: boolean = false;
  options: string[];
  selectedOptions: number[] = [];

  constructor(
    private globalService: GlobalService,
    private domSanitizer: DomSanitizer
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

  onChangeQuiz(quiz: Problem) {
    let _quiz = { ...quiz };
    _quiz.content.text = this.domSanitizer.bypassSecurityTrustHtml(_quiz.content.text.replace(/{{}}/g, '<input >'));
    this._quiz = _quiz;
    this.playAudio = false;
  }
}
