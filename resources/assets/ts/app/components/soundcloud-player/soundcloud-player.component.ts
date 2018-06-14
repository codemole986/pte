import {Component, OnInit, OnDestroy, AfterViewChecked, Input, Output, EventEmitter} from '@angular/core';

var SoundcloudWidget = require('soundcloud-widget');

@Component({
  selector: 'soundcloud-player',
  template: require('./soundcloud-player.component.html')
})
export class SoundcloudPlayerComponent implements OnInit, OnDestroy {
  private _iframeCode: string = '';

  src: string = '';
  show: boolean = false;
  finished: boolean = false;
  scWidget: any;

  scAudioPlayerId: string = 'sc-audio-player';

  @Input() set iframeCode(value: string) {
    this._iframeCode = value;

    let patternIframe = new RegExp('^<iframe(.+)</iframe>$');
    let patternSrc = new RegExp('(?<=src=").*?(?=["])');
    let patternAutoPlay = new RegExp('auto_play=(true|false)');

    if (value && patternIframe.test(value)) {
      let matches = value.match(patternSrc);
      let src = '';

      if (matches.length > 0) {
        src = matches[0].replace(patternAutoPlay, 'auto_play=true');
      }

      this.src = src;
    }
  }
  @Input() set play(value: boolean) {
    this.show = value;
  }

  @Output() finish = new EventEmitter<void>();

  constructor() {
    this.receiveMessage = this.receiveMessage.bind(this);
  }

  ngOnInit() {
    this.finished = false;

    window.addEventListener('message', this.receiveMessage, false);
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.receiveMessage);
    this.scWidget.removeListener(SoundcloudWidget.events.FINISH);
  }

  ngAfterViewChecked() {
    if (this.show) {
      this.scWidget = new SoundcloudWidget(this.scAudioPlayerId);

      this.scWidget.on(SoundcloudWidget.events.FINISH, () => {
        window.postMessage(SoundcloudWidget.events.FINISH, '*');
      });
    }
  }

  receiveMessage(event: MessageEvent) {
    const { data } = event;

    switch (data) {
      case SoundcloudWidget.events.FINISH:
        if (!this.finished) {
          this.finished = true;
          this.finish.emit();
        }
        break;

      default:
    }
  }
}
