import { Component, Input, OnInit } from '@angular/core';
import { compact, concat, each, isEmpty, last, map } from 'lodash';
import { Problem, ParagraphItem, Paragraph } from './../../model';

@Component({
  selector: 'fib-editor',
  template: require('./fib-editor.component.html'),
  styles: [`${require('./fib-editor.component.css')}`]
})
export class FIBEditorComponent implements OnInit {
  @Input() problem: Problem;
  @Input() selectable: boolean = false;

  paragraphs: Paragraph[] = [this.initParagraph()];

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

  saveItemWithOptions(item: ParagraphItem, indexParagraph: number, indexItem: number): void {
    this.paragraphs[indexParagraph].items[indexItem] = item;

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
    let paragraphs: Paragraph[] = [];
    let selectlist: { options: string[] }[] = [];
    let paragraphPattern = new RegExp(/<p>(.*?)<\/p>/g);
    let textParagraphs = compact(problem.content.text.split(paragraphPattern));

    each(textParagraphs, (p: string) => {
      let items = p.split('{{}}');
      let paragraph = this.initParagraph();

      each(items, (item: string, index: number) => {
        if (item) {
          paragraph.items.push({
            type: 'text',
            value: item
          });
        }

        if (index < items.length - 1) {
          if (this.selectable) {
            let options = problem.content.selectlist[index].options;
            let lengthOptions = options.length;
            let defaultOption = options.splice(0, 1);

            paragraph.items.push({
              type: 'blank',
              value: defaultOption,
              options
            });
          } else {
            paragraph.items.push({
              type: 'blank',
              value: problem.content.select.options[index]
            });
          }
        }
      });

      paragraphs.push(paragraph);
    });

    return paragraphs;
  }

  parseParagraphsToProblem(): void {
    let text: string = '';
    let options: string[] = [];
    let selectlist: { options: string[] }[] = [];

    each(this.paragraphs, (paragraph) => {
      text += '<p>';

      each(paragraph.items, (item) => {
        switch (item.type) {
          case 'text':
            text += item.value;
            break;

          case 'blank':
            text += '{{}}';

            if (this.selectable) {
              selectlist.push({ options: concat(item.value, item.options) });
            } else {
              options.push(item.value);
            }
            break;

          default:
            break;
        }
      });

      text += '</p>';
    });

    this.problem.content.text = text;
    if (this.selectable) {
      this.problem.content.selectlist = selectlist;
    } else {
      this.problem.content.select = { options };
    }
  }
}
