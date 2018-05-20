import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";

import { PipesModule } from './../../shared/pipes/';

import { SingleQuizComponent } from './single-quiz.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    PipesModule
  ],
  declarations: [
    SingleQuizComponent
  ],
  exports: [
    SingleQuizComponent
  ]
})
export class SingleQuizModule { }
