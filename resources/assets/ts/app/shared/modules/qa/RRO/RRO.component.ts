import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NestableSettings } from 'ngx-nestable/src/nestable.models';
import { concat, map, remove, shuffle } from 'lodash';

import { Problem } from './../../../../model/problem';
import { Answer } from './../../../../model/answer';
import { GlobalService } from './../../../../shared';

@Component({
  selector: 'app-qa-rro',
  template: require('./RRO.component.html'),
  styles: [`${require('./RRO.component.css')}`]
})

export class RROComponent {
  private _quiz: Problem;
  get quiz(): Problem {
    return this._quiz;
  }
  @Input() set quiz(quiz: Problem) {
    this._quiz = quiz;
    this.options = shuffle(map(quiz.content.select.options, option => ({ value: option })));
    this.selectedOptionNo = -1;
  }
  @Input() step: string;

  @Output() updateAnswer = new EventEmitter<{ select: { options: string[] } }>();

  count: number = 0;
  options: { value: string }[];
  selectedOptionNo: number = -1;

  public ngxNestableOptions = {
    fixedDepth: true
  } as NestableSettings;

  constructor(
    private globalService: GlobalService
  ) {
  }

  isMainStep(step: string): boolean {
    return step === this.globalService.STEP_MAIN;
  }

  onDropOption() {
    this.updateAnswer.emit({ select: { options: map(this.options, o => o.value) } });
  }
}
