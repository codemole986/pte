import {Component, Input} from "@angular/core";
//import {Song} from './interfaces/Song.ts';
import {Events} from '../interfaces/events.model';
import {SoundManager} from '../services/soundmanager.service';
import {PlaylistService} from '../services/playlist.service';
import { consts } from '../consts';

@Component({
	selector: 'controls',
	template:`
		<a href='#' id="btnPrevious" title="" (click)='previous()' *ngIf="false">
				<img src='${consts.baseUrl}images/prev.png'/>
		</a>
		<a id="btnPlayPause" (click)='togglePlayPause()' [class.hide]="hidePlayButton">
				<img src='${consts.baseUrl}images/play.png' [class.hide]='isPlaying'/>
				<img src='${consts.baseUrl}images/pause.png' [class.hide]='!isPlaying'/>
		</a>
		<a href='#' id="btnNextSong" (click)='next()' *ngIf="false">
				<img src='${consts.baseUrl}images/next.png'/>
		</a>
	`,
	styles: [
		`#btnPrevious{
				margin-right: 2px;
		}
		#btnPrevious img {
				width:30px;
				height:30px;
				margin-top:4px;
		}

		#btnPlayPause{
				box-sizing: border-box;
				margin-right: 2px;
		}

		#btnPlayPause img{
				width:40px;
				height:40px;
		}

		#btnNextSong{
				position: relative;
				box-sizing: border-box;
		}

		#btnNextSong img{
				margin-top: 4px;
				width: 30px;
				height: 30px;
		}
`
	]
})
export class ControlsCmp {
	@Input("is-playing") isPlaying: boolean;
	@Input("hide-play-button") hidePlayButton: boolean;
	@Input() song: any;

	constructor(private soundManager: SoundManager) {
		// this.soundManager.play(this.song);
	}

	togglePlayPause() {
		this.soundManager.togglePlayPause();
	}

	next() {
		this.soundManager.next();
	}

	previous() {
		this.soundManager.previous();
	}
}