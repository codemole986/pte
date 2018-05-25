import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';

import {SoundManager} from '../services/soundmanager.service';
import {PlaylistService} from '../services/playlist.service';

import {Song} from '../interfaces/song.model';
import {Events} from '../interfaces/events.model';

import {ControlsCmp} from "./controls.component";
import {VolumeCmp} from './volume.component';
import {SongImageCmp} from './song-image.component';

import {TimeSeekerCmp} from './time-seeker.component';
import {TimeInfoCmp} from './time-info.component';

@Component({
	selector: 'player',
	template: `
	<section class="player">
		<div class="row">
			<div class="col-xs-4 player-image">
				<song-image [song]="song"></song-image>
			</div>
			<div class="col-xs-8 player-info">
				<h2 class='song-title' *ngIf='song'>{{ song.name }}</h2>
				<h3 class="song-artist" *ngIf='song'>{{ song.artist }}</h3>
				<div class='controllerGroup'>
					<div style='margin-bottom: 16px;'>
						<time-info [song]="song" [time]="currentTime" [total-time]="totalTime"></time-info>
					</div>
					<controls [song]="song" [is-playing]="isPlaying"></controls>
					<div class='pull-right' *ngIf="false">
						<volume></volume>
					</div>
				</div>
			</div>
		</div>
		<div class="row" *ngIf="false">
			<div class="col-xs-12">
				<div class="row">
					<div class="col-xs-12">
						<time-info [song]="song" [time]="currentTime" [total-time]="totalTime"></time-info>
					</div>
				</div>
				<div class="row">
					<div class="col-xs-12">
						<time-seeker [time]="currentTime" [total-time]="totalTime"></time-seeker>
					</div>
				</div>
			</div>
		</div>
	</section>
	`,
	styles: [`
	.player{
		padding-top:7px;
		padding-left:7px;
		padding-bottom: 18px;
		padding-right: 7px;
		background-color: #fff;
	}

	.song-title {
		font-size: 14px;
		margin-top:4px;
		padding-bottom: 0;
		color:#000;
		margin-bottom: 7px;
	}

	.song-artist{
		font-size: 13px;
		margin-top: 6px;
		color:#939393;
	}
	.player-info {
		padding-left:0;
	}

	.controllerGroup{
		display: block;
		margin-top: 15px;
	}

	.controllerGroup a {
		text-decoration: none;
		outline: none;
	}

	.controllerGroup a:focus {
		text-decoration: none;
		outline: none;
	}
	`],
	//directives:[NgIf, ControlsCmp, VolumeCmp, SongImageCmp, TimeSeekerCmp, TimeInfoCmp]
})
export class PlayerCmp implements OnInit, OnDestroy {
	private _trackId: string = '';

	public song: Song;
	isPlaying: boolean;
	currentTime: number;
	totalTime: number;

	get trackId(): string { return this._trackId; };
	@Input() set trackId(value: string) {
		this._trackId = value;

		if (this.song) this.playlistService.remove(this.song);

    this.http.get(`/api/soundcloud/track/${value}`)
      .map((response: Response) => response.json())
      .subscribe((song: Song) => {
      	this.song = song;
				this.playlistService
						.getAll()
						.subscribe(playlistData => {});
				this.playlistService.publishChanges();
				this.soundManager.play(this.song);
      });
	}

	@Output() finish = new EventEmitter<Song>();

	constructor(private soundManager: SoundManager, private playlistService: PlaylistService, private http: Http) {
	}

	ngOnInit() {
		this.soundManager.on(Events.Pause, () => {
			this.isPlaying = false;
		});

		this.soundManager.on(Events.Play, () => {
			this.isPlaying = true;
		});

		this.soundManager.on(Events.PlayResume, () => {
			this.isPlaying = true;
		});

		this.soundManager.on(Events.Time, (time: number) => {
			this.currentTime = time;
			this.totalTime = this.soundManager.getTotalTime();
		});

		this.soundManager.on(Events.Finish, () => {
			console.log('Events.Finish');
			this.isPlaying = false;
			this.finish.emit(this.song);
		});
	}

	ngOnDestroy() {
		if (this.song) this.soundManager.stop(this.song);
	}
}