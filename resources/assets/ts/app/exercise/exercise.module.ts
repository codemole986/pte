import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { SingleQuizModule } from './single-quiz/single-quiz.module';
import { QAModule } from './../shared/modules';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  exports: [
    QAModule
  ]
})
export class ExerciseModule { }
