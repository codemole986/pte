import { Component, Input, Output, EventEmitter } from '@angular/core';
import { includes, indexOf, map, remove, slice, words } from 'lodash';

import { Problem } from './../../../../model/problem';
import { Answer } from './../../../../model/answer';
import { GlobalService } from './../../../../shared';

@Component({
  selector: 'app-qa-rsa',
  template: require('./RSA.component.html'),
  styles: [`${require('./RSA.component.css')}`]
})

export class RSAComponent {
  @Input() step: string;
  @Input() quiz: Problem;

  @Output() updateAnswer = new EventEmitter<{ optionno: number }>();

  count: number = 0;
  options: string[];

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

  toggleOption(no: number) {
    this.updateAnswer.emit({ optionno: no });
  }
}
