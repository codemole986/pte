import { Component, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'click-to-edit',
  template: require('./click-to-edit.component.html'),
  styles: [`${require('./click-to-edit.component.css')}`]
})
export class ClickToEditComponent implements AfterViewInit {
  @Input() min: number;
  @Input() max: number;
  @Input() field: string = 'field';
  @Input() unit: string = '';
  @Input() full: boolean = false;
  @Input() hideTrigger: boolean = false;
  @Input() type: string = 'string';
  @Input() show: boolean = false;

  @Input() set value(value: any) {
    this.theValue = value;
    this.original = this.theValue;
  }

  get value() {
    return this.theValue;
  }

  private theValue: any;
  private original: any;

  @Output() onSave = new EventEmitter<{ field: string, value: any }>();

  constructor() {
  }

  ngAfterViewInit(): void {
    if (typeof this.value === 'string') {
      this.type = 'string';
    }
    if (typeof this.value === 'number') {
      this.type = 'number';
    }
  }

  makeEditable(field: string): void {
    if (this.hideTrigger === true) {
      this.show = true;
    }
    if (this.full === false && field === 'trigger') {
      this.show = true;
    }
    else if (this.full === true) {
      this.show = true;
    }
  }

  cancelEditable(): void {
    this.show = false;
    this.value = this.original;
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
    this.onSave.emit({ field: this.field, value: this.value });
    this.show = false;
  }
}
