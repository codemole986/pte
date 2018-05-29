import { Component, OnInit, Input } from '@angular/core';

import { Problem } from './../../../model/problem';
import { GlobalService } from './../../../shared';

@Component({
  selector: 'app-exercise-single-spi',
  template: require('./spi.component.html'),
  styles: [`${require('./spi.component.css')}`]
})

export class SPIComponent implements OnInit {
  @Input() quiz: Problem;
  @Input() step: string;

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

  isListeningStep(step: string): boolean {
    return step === this.globalService.STEP_LISTENING;
  }

  isPostStep(step: string): boolean {
    return step === this.globalService.STEP_POST;
  }
}
