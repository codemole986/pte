import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SoundcloudPlayerComponent } from './soundcloud-player.component';

import { PipesModule } from './../../shared/pipes/';

import 'rxjs/Rx';

@NgModule({
  declarations: [
    SoundcloudPlayerComponent
  ],
  imports: [
    BrowserModule,
    PipesModule
  ],
  exports: [
    SoundcloudPlayerComponent
  ],
  bootstrap: [
    SoundcloudPlayerComponent
  ]
})
export class SoundcloudPlayerModule { }
