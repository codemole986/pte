import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SingleQuizModule } from './single-quiz/single-quiz.module';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  exports: [
    SingleQuizModule
  ]
})
export class ExerciseModule { }
