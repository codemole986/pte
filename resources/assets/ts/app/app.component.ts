import 'rxjs/add/operator/filter';

import { Component, OnInit } from '@angular/core';

import { AuthService } from './shared';

declare var Metronic: any;

@Component({
	selector: 'app-root',
	template: require('./app.component.html'),
	styles: [`${require('./app.component.css')}`]
})
export class AppComponent {
	public title = 'app';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.get();
  }
}
