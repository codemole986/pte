import { Component, EventEmitter, Input, Output } from '@angular/core';
import { remove } from 'lodash';
import { ParagraphItem } from './../../model';

@Component({
  selector: 'click-to-edit-selectable',
  template: require('./click-to-edit-selectable.component.html'),
  styles: [`${require('./click-to-edit-selectable.component.css')}`]
})
export class ClickToEditSelectableComponent {
  private theType: string;
  private theValue: string;
  private theOptions: string[] = [];
  private originalValue: string;
  private originalOptions: string[];

  @Input() full: boolean = false;
  @Input() show: boolean = false;

  get data() {
    return {
      type: this.theType,
      value: this.theValue,
      options: this.theOptions
    };
  }

  @Input() set data(data: ParagraphItem) {
    this.theType = data.type;
    this.theOptions = data.options;
    this.originalOptions = this.theOptions;
    this.theValue = data.value;
    this.originalValue = this.theValue;
  }

  @Input() set editable(value: boolean) {
    if (!value) {
      this.cancelEditable();
    }
  }

  @Output() onSave = new EventEmitter<ParagraphItem>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();

  constructor() {
  }

  makeEditable(): void {
    this.show = true;
  }

  cancelEditable(): void {
    this.show = false;
    this.theValue = this.originalValue;
    this.theOptions = this.originalOptions;
    this.onCancel.emit();
  }

  onKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.callSave();
    }
    if (event.key === 'Escape') {
      this.cancelEditable();
    }
  }

  callSave(): void {
    this.onSave.emit(this.data);
    this.show = false;
  }

  callDelete(): void {
    this.onDelete.emit();
  }

  addOption(): void {
    if (!this.theOptions) {
      this.theOptions = [''];
    } else {
      this.theOptions.push('');
    }
  }

  saveOption(value: string, index: number): void {
    this.theOptions[index] = value;
  }

  deleteOption(index: number): void {
    this.theOptions.splice(index, 1);
  }
}
