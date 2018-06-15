import { Component, OnInit, Input } from '@angular/core';

import { Problem } from './../../../../model/problem';
import { GlobalService } from './../../../../shared';

@Component({
  selector: 'app-qa-spi',
  template: require('./SPI.component.html'),
  styles: [`${require('./SPI.component.css')}`]
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

  isPostStep(step: string): boolean {
    return step === this.globalService.STEP_POST;
  }
}
