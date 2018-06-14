import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SolutionComponent } from './solution.component';

import 'rxjs/Rx';

@NgModule({
  declarations: [
    SolutionComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    SolutionComponent
  ],
  bootstrap: [
    SolutionComponent
  ]
})
export class SolutionModule { }
