import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Problem } from './../../../model/problem';
import { GlobalService } from './../../../shared';

@Component({
  selector: 'app-exercise-single-srl',
  template: require('./SRL.component.html'),
  styles: [`${require('./SRL.component.css')}`]
})

export class SRLComponent implements OnInit {
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
    this.onChangeQuiz(quiz);
  }

  @Output() finishAudio = new EventEmitter<string>();

  playAudio: boolean = false;

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

  onChangeQuiz(quiz: Problem) {
    this._quiz = { ...quiz };
    this.playAudio = false;
  }

  onFinish(song: any) {
    this.finishAudio.emit(this.globalService.STEP_MAIN);
  }
}
