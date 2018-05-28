import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";

import { PipesModule } from './../../shared/pipes/';
import { SoundCloudModule } from './../../components';

import { SingleQuizComponent } from './single-quiz.component';
import { WSMComponent } from './WSM/WSM.component';
import { WESComponent } from './WES/WES.component';
import { LWSComponent } from './LWS/LWS.component';
import { LSAComponent } from './LSA/LSA.component';
import { LTWComponent } from './LTW/LTW.component';
import { LSBComponent } from './LSB/LSB.component';
import { LCDComponent } from './LCD/LCD.component';
import { LTSComponent } from './LTS/LTS.component';
import { RSAComponent } from './RSA/RSA.component';

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
    LWSComponent,
    LSAComponent,
    LTWComponent,
    LSBComponent,
    LCDComponent,
    LTSComponent,
    RSAComponent
  ],
  exports: [
    SingleQuizComponent,
    WSMComponent,
    WESComponent,
    LWSComponent,
    LSAComponent,
    LTWComponent,
    LSBComponent,
    LCDComponent,
    LTSComponent,
    RSAComponent
  ]
})
export class SingleQuizModule { }
