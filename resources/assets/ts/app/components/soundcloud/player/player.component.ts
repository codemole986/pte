import {Component, OnInit, OnDestroy, AfterViewChecked, Input, Output, EventEmitter} from '@angular/core';

var SoundcloudWidget = require('soundcloud-widget');

@Component({
  selector: 'player',
  template: `
  <section *ngIf="show">
    <iframe [id]="scAudioPlayerId" [src]="src | safe" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay"></iframe>
  </section>
  `
})
export class PlayerCmp implements OnInit, OnDestroy {
  private _trackId: string = '';

  src: string = '';
  show: boolean = false;
  finished: boolean = false;
  scWidget: any;

  scAudioPlayerId: string = 'sc-audio-player';

  @Input() set trackId(value: string) {
    this._trackId = value;

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
  }

  ngAfterViewChecked() {
    if (this.show) {
      let scWidget = new SoundcloudWidget(this.scAudioPlayerId);

      scWidget.on(SoundcloudWidget.events.FINISH, () => {
        scWidget.removeListener(SoundcloudWidget.events.FINISH);
        window.postMessage(SoundcloudWidget.events.FINISH, '*');
      });
    }
  }

  receiveMessage(event: MessageEvent) {
    const { data } = event;
    if (data === SoundcloudWidget.events.FINISH && !this.finished) {
      this.finished = true;
      this.finish.emit();
    }
  }
}
