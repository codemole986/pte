import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Problem } from './../../../../model/problem';
import { GlobalService } from './../../../../shared';

@Component({
  selector: 'app-qa-srl',
  template: require('./SRL.component.html'),
  styles: [`${require('./SRL.component.css')}`]
})

export class SRLComponent {
  @Input() step: string;
  @Input() quiz: Problem;

  @Output() finishAudio = new EventEmitter<string>();

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
