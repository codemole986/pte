import { Component, OnInit, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';
import { snakeCase, words } from 'lodash';

import { Problem } from './../../../model/problem';
import { Answer } from './../../../model/answer';
import { GlobalService } from './../../../shared';

@Component({
  selector: 'app-exercise-single-lws',
  template: require('./lws.component.html'),
  styles: [`${require('./lws.component.css')}`]
})

export class LWSComponent implements OnInit, AfterViewChecked {
  private audioFinished: boolean = false;
  private _step: string;

  get step(): string {
    return this._step;
  }
  @Input() set step(step: string) {
    this.onChangeStep(step);
  }
  @Input() quiz: Problem;
  @Input() scAudioPlayerId: string;

  @Output() updateAnswer = new EventEmitter<{ text: string }>();
  @Output() finishAudio = new EventEmitter<string>();

  count: number = 0;

  constructor(
    private globalService: GlobalService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
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

  onChangeAnswerText(value: string) {
    this.count = words(value).length;
    this.updateAnswer.emit({ text: value });
  }

  onClickDownloadAnswerText(value: string) {
    this.globalService.downloadFile(value, `${snakeCase(this.quiz.title)}.txt`);
  }

  onChangeStep(step: string) {
    let _self = this;
    this._step = step;

    if (step === this.globalService.STEP_LISTENING) {
      let scWidget = SC.Widget(this.scAudioPlayerId);

      scWidget.play();

      window.addEventListener('onmessage', (m) => {
        console.log('onmessage: ', m);
      });

      // scWidget.bind(SC.Widget.Events.READY, () => {
      //   scWidget.unbind(SC.Widget.Events.READY);

      //   scWidget.bind(SC.Widget.Events.PLAY, () => {
      //     console.log('play');
      //     _self.audioFinished = false;
      //     scWidget.unbind(SC.Widget.Events.PLAY);
      //   });

      //   scWidget.bind(SC.Widget.Events.FINISH, function(event: MessageEvent) {
      //     console.log('finish');
      //     if (!_self.audioFinished) {
      //       _self.finishAudio.emit(_self.globalService.STEP_MAIN);
      //     }
      //     _self.audioFinished = true;

      //     scWidget.unbind(SC.Widget.Events.FINISH);
      //   });
      // });
    }
  }

  onFinish(song: any) {
    console.log(song);
  }
}
