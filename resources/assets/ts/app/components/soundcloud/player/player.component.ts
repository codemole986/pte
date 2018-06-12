import {Component, OnInit, OnDestroy, AfterViewChecked, Input, Output, EventEmitter} from '@angular/core';

declare var SC: any;

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
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ngAfterViewChecked() {
    if (this.show) {
      let _self = this;
      this.scWidget = SC.Widget(this.scAudioPlayerId);

      this.scWidget.bind(SC.Widget.Events.PLAY, () => {
        console.log('play');
        _self.scWidget.unbind(SC.Widget.Events.PLAY);
      });

      this.scWidget.bind(SC.Widget.Events.FINISH, function(e: any) {
        console.log('finish');
        _self.scWidget.unbind(SC.Widget.Events.FINISH);
        _self.finish.emit();
      });
    }
  }
}
