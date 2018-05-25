import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";

import { PipesModule } from './../../shared/pipes/';
import { SoundCloudModule } from './../../components';

import { SingleQuizComponent } from './single-quiz.component';
import { WSMComponent } from './WSM/WSM.component';
import { WESComponent } from './WES/WES.component';
import { LWSComponent } from './LWS/LWS.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    PipesModule,
    SoundCloudModule
  ],
  declarations: [
    SingleQuizComponent,
    WSMComponent,
    WESComponent,
    LWSComponent
  ],
  exports: [
    SingleQuizComponent,
    WSMComponent,
    WESComponent,
    LWSComponent
  ]
})
export class SingleQuizModule { }
