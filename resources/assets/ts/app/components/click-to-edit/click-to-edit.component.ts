import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'click-to-edit',
  template: require('./click-to-edit.component.html'),
  styles: [`${require('./click-to-edit.component.css')}`]
})
export class ClickToEditComponent {
  private theValue: string;
  private original: string;

  @Input() full: boolean = false;
  @Input() show: boolean = false;

  get value() {
    return this.theValue;
  }

  @Input() set value(value: string) {
    this.theValue = value;
    this.original = this.theValue;
  }

  @Input() set editable(value: boolean) {
    if (!value) {
      this.cancelEditable();
    }
  }

  @Output() onSave = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();

  constructor() {
  }

  makeEditable(): void {
    this.show = true;
  }

  cancelEditable(): void {
    this.show = false;
    this.theValue = this.original;
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
    this.onSave.emit(this.value);
    this.show = false;
  }

  callDelete(): void {
    this.onDelete.emit();
  }
}
