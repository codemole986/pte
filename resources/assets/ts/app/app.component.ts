import 'rxjs/add/operator/filter';

import { Component } from '@angular/core';

declare var Metronic: any;

@Component({
	selector: 'app-root',
	template: require('./app.component.html'),
	styles: [`${require('./app.component.css')}`]
})
export class AppComponent {
	public title = 'app';
}
