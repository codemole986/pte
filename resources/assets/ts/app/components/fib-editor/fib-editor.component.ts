import { Component, Input, OnInit } from '@angular/core';
import { each, isEmpty, last, map } from 'lodash';
import { Problem } from './../../model/problem';

interface ParagraphItem {
  type: string,
  value: any
}

interface Paragraph {
  items: ParagraphItem[]
}

@Component({
  selector: 'fib-editor',
  template: require('./fib-editor.component.html'),
  styles: [`${require('./fib-editor.component.css')}`]
})
export class FIBEditorComponent implements OnInit {
  @Input() problem: Problem;
  @Input() selectable: boolean = false;

  paragraphs: Paragraph[] = [this.initParagraph()];
  selectlist: { options: string[] }[] = [ { options: [''] }];

  constructor() {
  }

  ngOnInit() {
    this.paragraphs = this.parseProblemToParagraphs(this.problem);
  }

  canInsertText(indexParagraph: number): boolean {
    var lastItem = last(this.paragraphs[indexParagraph].items);

    if (isEmpty(lastItem)) return true;

    if (lastItem.type === 'text') return false;

    return true;
  }

  canInsertBlank(indexParagraph: number): boolean {
    var lastItem = last(this.paragraphs[indexParagraph].items);

    if (isEmpty(lastItem)) return true;

    if (lastItem.type === 'blank') return false;

    return true;
  }

  initParagraph(): Paragraph {
    return <Paragraph>{
      items: []
    };
  }

  insertText(indexParagraph: number): void {
    this.paragraphs[indexParagraph].items.push({
      type: 'text',
      value: ''
    });

    this.parseParagraphsToProblem();
  }

  insertBlank(indexParagraph: number): void {
    this.paragraphs[indexParagraph].items.push({
      type: 'blank',
      value: ''
    });

    this.parseParagraphsToProblem();
  }

  deleteParagraph(indexParagraph: number): void {
    this.paragraphs.splice(indexParagraph, 1);

    this.parseParagraphsToProblem();
  }

  insertParagraph(): void {
    if (!this.paragraphs) return;

    this.paragraphs.push(this.initParagraph());

    this.parseParagraphsToProblem();
  }

  saveItem(value: string, indexParagraph: number, indexItem: number): void {
    this.paragraphs[indexParagraph].items[indexItem].value = value;

    this.parseParagraphsToProblem();
  }

  saveItemWithOptions({ value, options }: { value: string, options: string[] }, indexParagraph: number, indexItem: number): void {
    this.paragraphs[indexParagraph].items[indexItem].value = value;

    let blankIndex = this.getBlankIndex(indexParagraph, indexItem);

    if (blankIndex > -1) {
      this.selectlist[blankIndex].options = options;
    }

    this.parseParagraphsToProblem();
  }

  deleteItem(indexParagraph: number, indexItem: number): void {
    this.paragraphs[indexParagraph].items.splice(indexItem, 1);

    this.parseParagraphsToProblem();
  }

  getBlankIndex(indexParagraph: number, indexItem: number): number {
    let blankIndex = -1;

    for (let p = 0; p <= indexParagraph; p ++) {
      for (let i = 0; i <= indexItem; i ++) {
        if (this.paragraphs[p].items[i].type === 'blank') {
          blankIndex ++;
        }
      }
    }

    return blankIndex;
  }

  parseProblemToParagraphs(problem: Problem): Paragraph[] {
    return this.paragraphs;
  }

  parseParagraphsToProblem(): void {
    let text: string = '';
    let options: string[] = [];

    each(this.paragraphs, (paragraph) => {
      text += '<p>';

      each(paragraph.items, (item) => {
        switch (item.type) {
          case 'text':
            text += item.value;
            break;

          case 'blank':
            text += '{{}}';
            options.push(item.value);
            break;

          default:
            text += item.value;
            break;
        }
      });

      text += '</p>';
    });

    this.problem.content.text = text;
    if (this.selectable) {
      this.problem.content.selectlist = [];
      each(options, (option, index) => {
        this.problem.content.selectlist.push({
          options: [ option, ...this.selectlist[index].options]
        });
      });
    } else {
      this.problem.content.select = { options };
    }
  }
}
