import {Song} from '../interfaces/song.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {StoreService} from './store.service';
import * as Rx from 'rxjs/Rx';
@Injectable()
export class PlaylistService {
	private _data: Song[];
	private _subscribers: any[];
	private currentSongIndex = -1;
	private $dataObservable: any;
	private $source: any;

	constructor(private storeService: StoreService) {
		this.$dataObservable = null;
		this._data = null;
		if (null == this._data) {
			this._data = [];
		}
		this.$source = this._createDataObservable();
	}

	add(song: Song) {
		var index = this._data.indexOf(song);
		if (index < 0) {
			this._data.push(song);
			this.syncWithLocalStorage();
			this.publishChanges();
		}
	}

	first(): Song {
		if (this._data.length == 0) return null;
		this.currentSongIndex = 0;
		return this._data[0];
	}

	next(): Song {
		if (this._data.length == 0) return null;
		if (this.currentSongIndex < this._data.length - 1) {
			this.currentSongIndex++;
		} else {
			this.currentSongIndex = 0;
		}
		return this._data[this.currentSongIndex];
	}

	previous(): Song {
		if (this._data.length == 0) return null;
		if (this.currentSongIndex > 0) {
			this.currentSongIndex--;
		} else {
			this.currentSongIndex = this._data.length - 1;
		}
		return this._data[this.currentSongIndex];
	}

	remove(song: Song) {
		var index = this._data.indexOf(song);
		this._data.splice(index, 1);
		this.syncWithLocalStorage();
		this.publishChanges();
	}

	setIndexBySong(song: Song) {
		var index = this._data.indexOf(song);
		if (index > -1) {
			this.currentSongIndex = index;
		}
	}

	getAll(): Observable<Array<Song>> {
		return this.$source;
	}

	private _createDataObservable() {
		return Rx.Observable.create((observer: any) => this.$dataObservable = observer).share();
	}

	publishChanges() {
		this.$dataObservable.next(this._data);
	}

	private syncWithLocalStorage() {
		//this.localStorageService.setObject('playlist_data', this._data);
	}
}