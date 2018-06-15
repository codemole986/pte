import { Component, Input, Output, EventEmitter } from '@angular/core';
import { snakeCase, words } from 'lodash';

import { Problem } from './../../../../model/problem';
import { Answer } from './../../../../model/answer';
import { GlobalService } from './../../../../shared';

@Component({
  selector: 'app-qa-lws',
  template: require('./LWS.component.html'),
  styles: [`${require('./LWS.component.css')}`]
})

export class LWSComponent {
  @Input() step: string;
  @Input() quiz: Problem;

  @Output() updateAnswer = new EventEmitter<{ text: string }>();
  @Output() finishAudio = new EventEmitter<string>();

  count: number = 0;

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

  onChangeAnswerText(value: string) {
    this.count = words(value).length;
    this.updateAnswer.emit({ text: value });
  }

  onClickDownloadAnswerText(value: string) {
    this.globalService.downloadFile(value, `${snakeCase(this.quiz.title)}.txt`);
  }

  onFinish(song: any) {
    this.finishAudio.emit(this.globalService.STEP_MAIN);
  }
}
