import {Component} from '@angular/core';
import {SoundManager} from '../services/soundmanager.service';
import {Events} from '../interfaces/events.model';
import {consts} from '../consts';

@Component({
	selector: 'volume',
	template: `
		<a id="btnToggleVolume" href='#' (click)='toggleMute()'>
			<img src='${consts.baseUrl}images/sound.png' [class.hide]='isMute'/>
			<img src='${consts.baseUrl}images/mute.png' [class.hide]='!isMute'/>
		</a>
	`,
	styles: [`

		#btnToggleVolume {
				width:20px;
		}
		#btnToggleVolume img{
				width:20px;
				padding-top:15px;
		}

		#btnToggleVolume i{
				margin-top:13px;
				color:#c7b4ab;
		}
	`]
})
export class VolumeCmp {

	isMute: boolean = false;

	constructor(private soundManager: SoundManager) {
		this.soundManager.on(Events.Volume, (isMute: boolean) => {
			this.isMute = isMute;
		});
	}

	toggleMute() {
		this.soundManager.toggleMute();
	}

}