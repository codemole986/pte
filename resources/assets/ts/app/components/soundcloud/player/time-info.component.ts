import {Component, Input} from '@angular/core';

import {Song} from '../interfaces/song.model';

@Component({
	selector: 'time-info',
	template: `
		<div class='time-info'>
			{{ formatTime(currentTime) }} / {{ formatTime(totalTime) }}
		</div>
	`
})
export class TimeInfoCmp {
	@Input('time') currentTime: number;
	@Input('total-time') totalTime: number;
	@Input('song') song: Song;

	constructor() {

	}

	formatTime(time: number) {
		if (!this.song || !this.currentTime || !this.totalTime) {
			return '00:00';
		}
		time = time / 1000;
		var minutes = Math.floor(time / 60);
		var seconds = Math.floor(time - minutes * 60);
		var minStr = minutes > 9 ? minutes.toString() : '0' + minutes.toString();
		var secStr = seconds > 9 ? seconds.toString() : '0' + seconds.toString();
		return minStr + ':' + secStr;
	}
}