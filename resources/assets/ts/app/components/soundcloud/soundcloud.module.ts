import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {PlaylistService} from './services/playlist.service';
import {SoundManagerSoundPlayer} from './services/soundmanager-player.service';
import {SoundManager} from './services/soundmanager.service';
import {StoreService} from './services/store.service';

import {PlayerCmp} from './player/player.component';
import {ControlsCmp} from "./player/controls.component";
import {VolumeCmp} from './player/volume.component';
import {SongImageCmp} from './player/song-image.component';
import {TimeSeekerCmp} from './player/time-seeker.component';
import {TimeInfoCmp} from './player/time-info.component';

import { PipesModule } from './../../shared/pipes/';

import 'rxjs/Rx';


@NgModule({
  declarations: [
    PlayerCmp,
    ControlsCmp,
    VolumeCmp,
    SongImageCmp,
    TimeSeekerCmp,
    TimeInfoCmp
  ],
  imports: [
    BrowserModule,
    PipesModule
  ],
  exports: [
    PlayerCmp
  ],
  providers: [
    PlaylistService,
    SoundManagerSoundPlayer,
    SoundManager,
    StoreService
  ],  
  bootstrap: [PlayerCmp]
})
export class SoundCloudModule { }
