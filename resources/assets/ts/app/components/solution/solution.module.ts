import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SolutionComponent } from './solution.component';
import { SoundcloudPlayerModule } from './../soundcloud-player/soundcloud-player.module';

import 'rxjs/Rx';

@NgModule({
  declarations: [
    SolutionComponent
  ],
  imports: [
    BrowserModule,
    SoundcloudPlayerModule
  ],
  exports: [
    SolutionComponent
  ],
  bootstrap: [
    SolutionComponent
  ]
})
export class SolutionModule { }
