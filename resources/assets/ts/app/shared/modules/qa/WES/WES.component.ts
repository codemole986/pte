import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { snakeCase, words } from 'lodash';

import { Problem } from './../../../../model/problem';
import { Answer } from './../../../../model/answer';
import { GlobalService } from './../../../../shared';

@Component({
  selector: 'app-qa-wes',
  template: require('./WES.component.html'),
  styles: [`${require('./WES.component.css')}`]
})

export class WESComponent implements OnInit {
  @Input() step: string;
  @Input() quiz: Problem;

  @Output() updateAnswer = new EventEmitter<{ text: string }>();

  count: number = 0;

  constructor(
    private globalService: GlobalService
  ) {
  }

  ngOnInit() {
  }

  isPreStep(step: string): boolean {
    return step === this.globalService.STEP_PRE;
  }

  isMainStep(step: string): boolean {
    return step === this.globalService.STEP_MAIN;
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
}
