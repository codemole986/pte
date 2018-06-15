import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Problem } from './../../../../model/problem';
import { GlobalService } from './../../../../shared';

@Component({
  selector: 'app-qa-srs',
  template: require('./SRS.component.html'),
  styles: [`${require('./SRS.component.css')}`]
})

export class SRSComponent {
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

  isPostStep(step: string): boolean {
    return step === this.globalService.STEP_POST;
  }

  onFinish(song: any) {
    this.finishAudio.emit(this.globalService.STEP_MAIN);
  }
}
