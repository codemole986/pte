import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Problem } from './../../../../model/problem';
import { GlobalService } from './../../../../shared';

@Component({
  selector: 'app-qa-sal',
  template: require('./SAL.component.html'),
  styles: [`${require('./SAL.component.css')}`]
})

export class SALComponent implements OnInit {
  @Input() quiz: Problem;
  private _step: string;
  get step(): string {
    return this._step;
  }
  @Input() set step(step: string) {
    this._step = step;

    if (this.isMainStep(step)) {
      this.startRecord.emit();
    } else if (this.isPostStep(step)) {
      this.stopRecord.emit();
    }
  }

  @Output() startRecord = new EventEmitter<void>();
  @Output() stopRecord = new EventEmitter<void>();

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
