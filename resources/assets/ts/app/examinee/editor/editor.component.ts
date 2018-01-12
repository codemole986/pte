import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  template: require('./editor.component.html'),
  styles: [`${require('./editor.component.css')}`],
  inputs: ['data']
})
export class EditorComponent implements OnInit {
	data: number;
	constructor() { }

	ngOnInit() {
	}

}
