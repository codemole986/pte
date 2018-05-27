import { Component, Input, Output, EventEmitter } from '@angular/core';
import { includes, indexOf, map, remove, slice, words } from 'lodash';

import { Problem } from './../../../model/problem';
import { Answer } from './../../../model/answer';
import { GlobalService } from './../../../shared';

@Component({
  selector: 'app-exercise-single-lsb',
  template: require('./lsb.component.html'),
  styles: [`${require('./lsb.component.css')}`]
})

export class LSBComponent {
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

  @Output() updateAnswer = new EventEmitter<{ optionno: number[] }>();
  @Output() finishAudio = new EventEmitter<string>();

  count: number = 0;
  playAudio: boolean = false;
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

  isListeningStep(step: string): boolean {
    return step === this.globalService.STEP_LISTENING;
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
