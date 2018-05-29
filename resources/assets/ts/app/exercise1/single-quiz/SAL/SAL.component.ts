import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Problem } from './../../../model/problem';
import { GlobalService } from './../../../shared';

@Component({
  selector: 'app-exercise-single-sal',
  template: require('./sal.component.html'),
  styles: [`${require('./sal.component.css')}`]
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

  isListeningStep(step: string): boolean {
    return step === this.globalService.STEP_LISTENING;
  }

  isPostStep(step: string): boolean {
    return step === this.globalService.STEP_POST;
  }
}
