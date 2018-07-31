import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ClickToEditModule } from './../';

import { FIBEditorComponent } from './fib-editor.component';

import 'rxjs/Rx';

@NgModule({
  declarations: [
    FIBEditorComponent
  ],
  imports: [
    BrowserModule,
    ClickToEditModule
  ],
  exports: [
    FIBEditorComponent
  ],
  bootstrap: [
    FIBEditorComponent
  ]
})
export class FIBEditorModule { }
