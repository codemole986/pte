import { Component, Input, Output, EventEmitter } from '@angular/core';
import { concat, remove } from 'lodash';

import { Problem } from './../../../model/problem';
import { Answer } from './../../../model/answer';
import { GlobalService } from './../../../shared';

@Component({
  selector: 'app-exercise-single-rro',
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
    this.options = quiz.content.select.options;
    this.selectedOptionNo = -1;
  }
  @Input() step: string;

  @Output() updateAnswer = new EventEmitter<{ select: { options: string[] } }>();

  count: number = 0;
  options: string[];
  selectedOptionNo: number = -1;

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

  onSelectOption(no: number) {
    this.selectedOptionNo = no;
  }

  onUpOption(no: number) {
    if (no > 0) {
      this.options.splice(no - 1, 0, this.options[no]);
      this.options.splice(no + 1, 1);
      this.selectedOptionNo = no - 1;

      this.updateAnswer.emit({ select: { options: this.options } });
    }
  }

  onDownOption(no: number) {
    if (no === -1) return;

    if (no < this.options.length - 1) {
      this.options.splice(no + 2, 0, this.options[no]);
      this.options.splice(no, 1);
      this.selectedOptionNo = no + 1;

      this.updateAnswer.emit({ select: { options: this.options } });
    }
  }
}
