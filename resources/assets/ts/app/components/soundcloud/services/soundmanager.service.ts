import {Injectable} from '@angular/core';
import {Song} from '../interfaces/song.model';
import {Events} from '../interfaces/events.model';
import {ISoundPlayer} from '../interfaces/isound-player.model';
import {SoundManagerSoundPlayer} from './soundmanager-player.service';
import {PlaylistService} from './playlist.service';
@Injectable()
export class SoundManager {
	private soundPlayer: any;
	private subscribers: Object = {};
	private currentSong: Song;
	private isPlaying = false;
	private isMute = false;
	constructor(private soundManagerSoundPlayer: SoundManagerSoundPlayer,
							private playlistService: PlaylistService) {

	}

	private getSoundPlayer(song: Song) {
		return this.soundManagerSoundPlayer;
	}

	play(song: Song) {
		this.playlistService.add(song); //Auto add song to playlist
		this.playlistService.setIndexBySong(song);
		this.currentSong = song;

		if (!this.soundPlayer) {
			this.soundPlayer = this.getSoundPlayer(song);
			this.subscribSoundPlayerEvent(this.soundPlayer);
		}

		this.soundPlayer.initialize(song, (e: Error) => {
			if (!e) {
				this.soundPlayer.play();
				this.publish(Events.ChangeSong, song);
				this.isPlaying = true;
			} else {
				alert(e.message);
			}
		});
	}

	pause() {
		if (this.currentSong !== null) {
			if (this.isPlaying) {
				this.soundPlayer.pause();
			}
		}
	}

	stop(song: Song) {
		this.soundPlayer.pause();
		this.playlistService.remove(song);
		this.currentSong = null;
	}

	togglePlayPause() {
		if (this.currentSong != null) {
			if (!this.isPlaying) {
				this.soundPlayer.play();
			} else {
				this.soundPlayer.pause();
			}
		} else {
			var song = this.playlistService.first();
			this.play(song);
		}
	}

	next() {
		var song = this.playlistService.next();
		if (song) this.play(song);
	}

	previous() {
		var song = this.playlistService.previous();
		if (song) {
			this.play(song);
		}
	}

	seek(time: number) {
		if (this.soundPlayer && this.currentSong) {
			this.soundPlayer.seek(time);
		}
	}

	toggleMute() {
		if (this.currentSong) {
			if (this.isMute) {
				this.soundPlayer.setVolume(100);
				this.isMute = false;
				this.publish(Events.Volume, false);
			} else {
				this.soundPlayer.setVolume(0);
				this.isMute = true;
				this.publish(Events.Volume, true);
			}
		}
	}

	getTotalTime() {
		if (this.soundPlayer && this.currentSong) {
			return this.soundPlayer.totalTime();
		}
		return null;
	}

	on(event: any, handler: any) {
		if (!this.subscribers[event]) this.subscribers[event] = [];
		this.subscribers[event].push(handler);
	}

	private publish(event: any, data: any) {
		// console.log('Publish event:', event, data);
		if (this.subscribers[event]) {
			this.subscribers[event].forEach(function(handler: any) {
				handler(data);
			});
		}
	}

	getCurrentSong(): Song {
		return this.currentSong;
	}

	onSongFinish() {
		this.publish(Events.Finish, null);
	}

	subscribSoundPlayerEvent(soundPlayer: ISoundPlayer) {

		soundPlayer.on(Events.Play, () => {
			this.publish(Events.Play, null);
			this.isPlaying = true;
		});

		soundPlayer.on(Events.PlayStart, () => {
			this.publish(Events.PlayStart, null);
			this.isPlaying = true;
		});

		soundPlayer.on(Events.PlayResume, () => {
			this.publish(Events.PlayResume, null);
			this.isPlaying = true;
		});

		soundPlayer.on(Events.Pause, () => {
			this.publish(Events.Pause, null);
			this.isPlaying = false;
		});

		soundPlayer.on(Events.Finish, () => {
			this.publish(Events.Finish, null);
			this.isPlaying = false;
			this.onSongFinish();
		});

		soundPlayer.on(Events.Seek, () => this.publish(Events.Seek, null));

		soundPlayer.on(Events.Seeked, () => this.publish(Events.Seeked, null));

		soundPlayer.on(Events.Time, (time) => {
			this.publish(Events.Time, time);
		});

		soundPlayer.on(Events.AudioError, () => {
			this.publish(Events.AudioError, null);
			this.isPlaying = false;
		});

		soundPlayer.on(Events.NoStreams, () => this.publish(Events.NoStreams, null));

	}
}