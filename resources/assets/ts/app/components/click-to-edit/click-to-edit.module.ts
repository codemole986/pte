import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { ClickToEditComponent } from './click-to-edit.component';

import 'rxjs/Rx';

@NgModule({
  declarations: [
    ClickToEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    ClickToEditComponent
  ],
  bootstrap: [
    ClickToEditComponent
  ]
})
export class ClickToEditModule { }
