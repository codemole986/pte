import {Component, Input} from '@angular/core';
import {Song} from '../interfaces/song.model';
import {consts} from "../consts";

@Component({
	selector: 'song-image',
	template: `
		<img class='artist-image'
					[src]='getImageUrl()'/>
	`,
	styles: [`
	.artist-image{
		border-radius: 100px;
		box-sizing:border-box;
		border: 5px solid #dedede;
		width:100%;
	}
	`]
})
export class SongImageCmp {
	@Input() song: any;

	private DefaultImageUrl = consts.baseUrl+"images/artist_placeholder.png";

	getImageUrl() {
		if (this.song && this.song.imageUrl) {
			return this.song.imageUrl;
		}
		return this.DefaultImageUrl;
	}
}
