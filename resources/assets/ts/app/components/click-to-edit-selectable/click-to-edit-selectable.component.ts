import { Component, EventEmitter, Input, Output } from '@angular/core';
import { remove } from 'lodash';

@Component({
  selector: 'click-to-edit-selectable',
  template: require('./click-to-edit-selectable.component.html'),
  styles: [`${require('./click-to-edit-selectable.component.css')}`]
})
export class ClickToEditSelectableComponent {
  private theValue: string;
  private originalValue: string;
  private theOptions: string[] = [];
  private originalOptions: string[];

  @Input() full: boolean = false;
  @Input() show: boolean = false;

  get value() {
    return this.theValue;
  }

  @Input() set value(value: string) {
    this.theValue = value;
    this.originalValue = this.theValue;
  }

  get options() {
    return this.theOptions;
  }

  @Input() set options(value: string[]) {
    this.theOptions = value;
    this.originalOptions = this.theOptions;
  }

  @Input() set editable(value: boolean) {
    if (!value) {
      this.cancelEditable();
    }
  }

  @Output() onSave = new EventEmitter<{ value: string, options: string[] }>();
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
    this.onSave.emit({ value: this.value, options: this.theOptions });
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
