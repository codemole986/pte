import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor/editor.component';
import { ProblemComponent } from './problem/problem.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [EditorComponent, ProblemComponent]
})
export class ExamineeModule { }
