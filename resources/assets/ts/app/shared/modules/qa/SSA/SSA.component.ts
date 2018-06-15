import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Problem } from './../../../../model/problem';
import { GlobalService } from './../../../../shared';

@Component({
  selector: 'app-qa-ssa',
  template: require('./SSA.component.html'),
  styles: [`${require('./SSA.component.css')}`]
})

export class SSAComponent {
  @Input() step: string;
  @Input() quiz: Problem;

  @Output() finishAudio = new EventEmitter<string>();

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

  onFinish(song: any) {
    this.finishAudio.emit(this.globalService.STEP_MAIN);
  }
}
