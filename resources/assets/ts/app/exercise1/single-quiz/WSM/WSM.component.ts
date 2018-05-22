import { Component, OnInit, Input } from '@angular/core';
import { snakeCase, words } from 'lodash';

import { Problem } from './../../../model/problem';
import { Answer } from './../../../model/answer';
import { GlobalService } from './../../../shared';

@Component({
  selector: 'app-exercise-single-wsm',
  template: require('./wsm.component.html'),
  styles: [`${require('./wsm.component.css')}`]
})

export class WSMComponent implements OnInit {
  @Input() quiz: Problem;
  @Input() step: string;

  answer: Answer;
  count: number = 0;

  constructor(
    private globalService: GlobalService
  ) {
  }

  ngOnInit() {
    this.answer = new Answer;
    this.answer.answer = {
      text: ''
    };
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

  onChangeAnswer(value: string) {
    this.answer.answer.text = value;
    this.count = words(value).length;
  }

  onClickDownloadAnswerText() {
    this.globalService.downloadFile(this.answer.answer.text, `${snakeCase(this.quiz.title)}.txt`);
  }
}
