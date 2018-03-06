import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-contactus',
    template: require('./contactus.component.html'),
    styles: [`${require('./contactus.component.css')}`]
})
export class ContactusComponent implements OnInit {
    active_menu: string = "overview";

    constructor(private translate: TranslateService, public router: Router) {

    }

    ngOnInit() {
    	switch(window.sessionStorage.getItem('permission')) {
    		case 'A' : this.active_menu = "manage"; break;
			case 'B' : this.active_menu = "teacher"; break;
			case 'D' : this.active_menu = "student"; break;
			default : this.active_menu = "overview";
    	}

    }
}
