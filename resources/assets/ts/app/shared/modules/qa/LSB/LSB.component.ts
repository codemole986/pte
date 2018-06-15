import { Component, Input, Output, EventEmitter } from '@angular/core';
import { includes, indexOf, map, remove, slice, words } from 'lodash';

import { Problem } from './../../../../model/problem';
import { Answer } from './../../../../model/answer';
import { GlobalService } from './../../../../shared';

@Component({
  selector: 'app-qa-lsb',
  template: require('./LSB.component.html'),
  styles: [`${require('./LSB.component.css')}`]
})

export class LSBComponent {
  @Input() step: string;
  @Input() quiz: Problem;

  @Output() updateAnswer = new EventEmitter<{ optionno: number[] }>();
  @Output() finishAudio = new EventEmitter<string>();

  count: number = 0;
  options: string[];
  selectedOptions: number[] = [];

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

  isPostStep(step: string): boolean {
    return step === this.globalService.STEP_POST;
  }

  toggleOption(no: number) {
    if (includes(this.selectedOptions, no)) {
      remove(this.selectedOptions, (o: number) => o === no);
    } else {
      this.selectedOptions.push(no);
    }

    this.updateAnswer.emit({ optionno: this.selectedOptions });
  }

  onFinish(song: any) {
    this.finishAudio.emit(this.globalService.STEP_MAIN);
  }
}
