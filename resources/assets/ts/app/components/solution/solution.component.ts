import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { join, map } from 'lodash';

import { Problem } from './../../model/problem';

@Component({
  selector: 'app-solution',
  template: require('./solution.component.html'),
  styles: [`${require('./solution.component.css')}`]
})
export class SolutionComponent {
  html: SafeHtml;
  audio: string = '';

  @Input() set problem(value: Problem) {
    this.makeHtml(value);
  }

  constructor(
    private domSanitizer: DomSanitizer
  ) {}

  makeHtml(problem: Problem) {
    const { type, solution, content } = problem;
    const bracePattern = new RegExp(/\{\{\}\}/);

    switch (type) {
      case 'LSA':
      case 'RMA': {
        const options = map(solution.optionno, (no) => content.select.options[no]);
        this.html = join(options, '<br/>');
        break;
      }

      case 'LTW':
      case 'RFB': {
        let solutionText = solution.text;
        let index = 0;

        while (bracePattern.test(solutionText)) {
          let input = `<input value="${content.select.options[index]}" disabled />`;
          solutionText = solutionText.replace(bracePattern, input);
          index ++;
        }

        this.html = this.domSanitizer.bypassSecurityTrustHtml(solutionText);

        break;
      }

      case 'LSB':
      case 'RSA': {
        this.html = content.select.options[solution.optionno];
        break;
      }

      case 'LCD': {
        let solutionText = solution.text;
        let index = 0;

        while (bracePattern.test(solutionText)) {
          solutionText = solutionText.replace(bracePattern, content.select.options[index]);
          index ++;
        }

        this.html = solutionText;

        break;
      }

      case 'RAN': {
        let solutionText = solution.text;
        let index = 0;

        while (bracePattern.test(solutionText)) {
          let input = `<input value="${content.selectlist[index].options[solution.optionno[index].option]}" disabled />`;
          solutionText = solutionText.replace(bracePattern, input);
          index ++;
        }

        this.html = this.domSanitizer.bypassSecurityTrustHtml(solutionText);

        break;
      }

      case 'RRO': {
        this.html = map(content.select.options, o => `<p>${o}</p>`).join('');
        break;
      }

      case 'SAL':
      case 'SRS':
      case 'SPI':
      case 'SRL': {
        this.audio = solution.audio;

        break;
      }

      default: {
        this.html = solution.text;
      }
    }
  }
}
