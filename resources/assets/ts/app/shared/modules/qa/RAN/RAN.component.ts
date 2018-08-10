import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { each, join, map, shuffle } from 'lodash';

import { Problem, ParagraphItem, Paragraph } from './../../../../model';
import { Answer } from './../../../../model/answer';
import { GlobalService } from './../../../../shared';

@Component({
  selector: 'app-qa-ran',
  template: require('./RAN.component.html'),
  styles: [`${require('./RAN.component.css')}`]
})

export class RANComponent {
  private _step: string;
  private _quiz: Problem;

  get step(): string {
    return this._step;
  }
  @Input() set step(step: string) {
    this._step = step;
  }
  get quiz(): Problem {
    return this._quiz;
  }
  @Input() set quiz(quiz: Problem) {
    this.onChangeQuiz(quiz);
  }

  @Output() updateAnswer = new EventEmitter<{ optionno: number[] }>();

  options: {no: number, value: string}[] = [];
  selectedOptions: number[] = [];
  paragraphs: Paragraph[];

  constructor(
    private globalService: GlobalService,
    private domSanitizer: DomSanitizer,
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

  onChangeQuiz(quiz: Problem) {
    let _quiz = { ...quiz };

    if (typeof _quiz.content.text === 'string') {
      _quiz.solution.text = _quiz.content.text;
    }

    this._quiz = _quiz;
    this.paragraphs = this.parseProblemToParagraphs(quiz);
  }

  selectOption(optionno: number) {
    console.log(optionno);
  }

  parseProblemToParagraphs(problem: Problem): Paragraph[] {
    let paragraphs: Paragraph[] = [];
    let selectlist: { options: string[] }[] = [];
    let paragraphPattern = new RegExp(/<p>(.*?)<\/p>/g);
    let textParagraphs = problem.content.text.split(paragraphPattern);

    each(textParagraphs, (p: string) => {
      let items = p.split('{{}}');
      let paragraph = new Paragraph();
      paragraph.items = [];

      each(items, (item: string, index: number) => {
        if (item) {
          paragraph.items.push({
            type: 'text',
            value: item
          });
        }

        if (index < items.length - 1) {
          let options = problem.content.selectlist[index].options;
          let defaultOption = options[0];

          paragraph.items.push({
            type: 'blank',
            value: defaultOption,
            options: shuffle(map(options, (value, no) => ({ value, no })))
          });
        }
      });

      paragraphs.push(paragraph);
    });

    return paragraphs;
  }
}
