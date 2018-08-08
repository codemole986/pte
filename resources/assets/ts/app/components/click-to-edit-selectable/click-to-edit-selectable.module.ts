import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { ClickToEditModule } from './../';
import { ClickToEditSelectableComponent } from './click-to-edit-selectable.component';

import 'rxjs/Rx';

@NgModule({
  declarations: [
    ClickToEditSelectableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ClickToEditModule
  ],
  exports: [
    ClickToEditSelectableComponent
  ],
  bootstrap: [
    ClickToEditSelectableComponent
  ]
})
export class ClickToEditSelectableModule { }
