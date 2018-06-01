import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { includes, indexOf, join, map, remove, slice, words } from 'lodash';

import { Problem } from './../../../model/problem';
import { Answer } from './../../../model/answer';
import { GlobalService } from './../../../shared';

@Component({
  selector: 'app-exercise-single-ran',
  template: require('./RAN.component.html'),
  styles: [`${require('./RAN.component.css')}`]
})

export class RANComponent {
  private _step: string;
  private _quiz: Problem;

  get step(): string {
    return this._step;
  }
  @Input() set step(step: string) {
    this._step = step;
  }
  get quiz(): Problem {
    return this._quiz;
  }
  @Input() set quiz(quiz: Problem) {
    this.onChangeQuiz(quiz);
  }

  @Output() updateAnswer = new EventEmitter<{ optionno: number[] }>();

  count: number = 0;
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

    _quiz.content.selectlist.forEach(({ options }: { options: string[] }) => {
      _quiz.content.text = _quiz.content.text.replace(/{{}}/, `<select>${join(map(options, (option: string) => (`<option>${option}</option>`)))}</select>`);
    });

    _quiz.content.text = this.domSanitizer.bypassSecurityTrustHtml(_quiz.content.text);
    this._quiz = _quiz;
  }
}
