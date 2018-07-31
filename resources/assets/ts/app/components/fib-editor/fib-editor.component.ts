import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fib-editor',
  template: require('./fib-editor.component.html'),
  styles: [`${require('./fib-editor.component.css')}`]
})
export class FIBEditorComponent implements OnInit {
  editingText: boolean = false;
  editingBlank: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  startEditingText() {
    this.editingText = true;
  }

  exitEditingText() {
    this.editingText = false;
  }

  startInsertBlank() {
    this.editingBlank = true;
  }
}
