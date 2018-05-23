import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";

import { PipesModule } from './../../shared/pipes/';

import { SingleQuizComponent } from './single-quiz.component';
import { WSMComponent } from './WSM/WSM.component';
import { WESComponent } from './WES/WES.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    PipesModule
  ],
  declarations: [
    SingleQuizComponent,
    WSMComponent,
    WESComponent
  ],
  exports: [
    SingleQuizComponent,
    WSMComponent,
    WESComponent
  ]
})
export class SingleQuizModule { }
