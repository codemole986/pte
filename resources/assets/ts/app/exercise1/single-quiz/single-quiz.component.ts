import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { indexOf, isEmpty, map } from 'lodash';

import { GlobalService, TimerService } from './../../shared';

import { Problem } from './../../model/problem';

declare var SC: any;

@Component({
  selector: 'app-exercise-single-quiz',
  template: require('./single-quiz.component.html'),
  styles: [`${require('./single-quiz.component.css')}`]
})

export class SingleQuizComponent implements OnInit {
  private frequency: number = 1000;
  private scAudioPlayerId: string = 'sc-audio-player';
  private _quiz: Problem;

  get quiz(): Problem {
    return this._quiz;
  }
  @Input() set quiz(quiz: Problem) {
    this.onChangeQuiz(quiz);
    this.restartTimer();
  }

  step: string;
  steps: string[];
  remainingTime: number = 0;

  constructor(
    private globalService: GlobalService,
    private translate: TranslateService,
    private timerService: TimerService
  ) {
    this.timerService.start();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  private initTimer() {
    const _self = this;

    const _calcRemainingTime = _self.calcRemainingTime;

    _self.calcRemainingTime = (count: number = 0) => {
      console.log(count);
      return _calcRemainingTime.apply(_self, [count]);
    };

    _self.timerService.add(_self.calcRemainingTime, _self.frequency);

    return _self;
  }

  private calcRemainingTime(count: number): void {
    if (this.step !== this.globalService.STEP_PRE && this.step !== this.globalService.STEP_MAIN) return;

    this.remainingTime -= count;

    if (this.remainingTime <=0) this.goToNextStep();
  }

  private onChangeQuiz(quiz: Problem) {
    const { preparation_time, limit_time, id, content } = quiz;
    const { audio } = content;
    const patternIframe = new RegExp('^<iframe(.+)</iframe>$');
    const patternSrc = new RegExp('(?<=src=").*?(?=["])');
    const patternAutoPlay = new RegExp('auto_play=(true|false)');

    if (audio && patternIframe.test(audio)) {
      let src = '';
      const matches = audio.match(patternSrc);

      if (matches.length > 0) {
        src = matches[0].replace(patternAutoPlay, 'auto_play=true');
        quiz.content.audio = src;

        const _self = this;

        window.addEventListener('message', (event: MessageEvent) => {
          const { origin } = event;

          if (origin === 'https://w.soundcloud.com') {
            const scWidget = SC.Widget(_self.scAudioPlayerId);

            scWidget.bind(SC.Widget.Events.PLAY, () => {
              console.log('play');
            });

            scWidget.bind(SC.Widget.Events.FINISH, function(event: MessageEvent) {
              console.log('finish');
              _self.goToStep(_self.globalService.STEP_MAIN);
            });
          }
        });
      }
    }

    this._quiz = quiz;
    this.steps = this.globalService.getSteps(quiz.type);

    this.goToPreStep();
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

  goToPreStep() {
    this.step = this.globalService.STEP_PRE;
  }

  goToMainStep() {
    this.step = this.globalService.STEP_MAIN;
  }

  goToPostStep() {
    this.step = this.globalService.STEP_POST;
  }

  restartTimer(): void {
    this.stopTimer();
    this.initTimer();
    this.timerService.start();
  }

  stopTimer() {
    this.timerService.remove(this.calcRemainingTime);
  }

  goToNextStep() {
    if (isEmpty(this.steps)) return;

    const index = indexOf(this.steps, this.step);

    if (index < this.steps.length - 1) {
      this.goToStep(this.steps[index + 1]);
    }
  }

  goToPrevStep() {
    if (isEmpty(this.steps)) return;

    const index = indexOf(this.steps, this.step);

    if (index > 0) {
      this.goToStep(this.steps[index - 1]);
    }
  }

  goToStep(step: string) {
    if (isEmpty(this._quiz) || step === this.step) return;

    const { preparation_time, limit_time, id } = this._quiz;

    this.step = step;

    switch (this.step) {
      case this.globalService.STEP_LISTENING:
        return;
      case this.globalService.STEP_MAIN:
        this.remainingTime = limit_time;
        this.restartTimer();

        return;
      case this.globalService.STEP_POST:
        return;
      case this.globalService.STEP_PRE:
      default:
        this.remainingTime = preparation_time;
        this.restartTimer();

        return;
    }
  }

  getTypes(category: string) {
    return this.globalService.problemTypes[category];
  }

  getTypeName(category: string, value: string) {
    const arr_types: { value: string, title: string }[] = this.getTypes(category);

    if(arr_types != null) {
      for (let i = 0;  i < arr_types.length; i++) {
        if (arr_types[i].value == value)
          return arr_types[i].title;
      }
    }

    return '';
  }
}
