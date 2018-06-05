import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { each, includes, indexOf, join, map, remove, slice, words } from 'lodash';

import { Problem } from './../../../../model/problem';
import { Answer } from './../../../../model/answer';
import { GlobalService } from './../../../../shared';

@Component({
  selector: 'app-qa-lcd',
  template: require('./LCD.component.html'),
  styles: [`${require('./LCD.component.css')}`]
})

export class LCDComponent {
  private _step: string;
  private _quiz: Problem;

  get step(): string {
    return this._step;
  }
  @Input() set step(step: string) {
    this._step = step;

    if (this.isListeningStep(step) || this.isMainStep(step)) {
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

  @Output() updateAnswer = new EventEmitter<{ optionno: number[] }>();
  @Output() finishAudio = new EventEmitter<string>();

  count: number = 0;
  playAudio: boolean = false;
  options: string[];
  selectedOptions: number[] = [];
  spans: { text: any, clickable: boolean, selected: boolean, isBR: boolean }[];

  constructor(
    private globalService: GlobalService,
    private domSanitizer: DomSanitizer
  ) {
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
    this.spans = [];
    let bracePattern = new RegExp(/\{\{\}\}/);
    let linebreakPattern = new RegExp(/(\r\n|\r|\n)/);
    let alphanumericPattern = new RegExp(/^[a-zA-Z\d_]*$/);
    let _quiz = { ...quiz };
    _quiz.content.text = _quiz.content.text.replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/&nbsp;/g, ' ');

    let i = 0;
    while(bracePattern.test(_quiz.content.text)) {
      _quiz.content.text = _quiz.content.text.replace(bracePattern, _quiz.content.select.options[i]);
      i ++;
    }

    let str = '';
    each(_quiz.content.text, (ch: string) => {
      if (alphanumericPattern.test(ch)) {
        str += ch;
      } else {
        this.spans.push({
          text: str,
          clickable: true,
          selected: false,
          isBR: false
        });

        str = '';

        if (linebreakPattern.test(ch)) {
          this.spans.push({
            text: '',
            clickable: false,
            selected: false,
            isBR: true
          });
        } else {
          this.spans.push({
            text: ch,
            clickable: false,
            selected: false,
            isBR: false
          });
        }
      }
    });

    this._quiz = _quiz;
    this.playAudio = false;
  }

  onToggleSpan(index: number) {
    this.spans[index].selected = !this.spans[index].selected;
  }
}
