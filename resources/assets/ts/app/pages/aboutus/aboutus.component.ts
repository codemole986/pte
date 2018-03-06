import { Component, OnInit, Input  } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-aboutus',
    template: require('./aboutus.component.html'),
    styles: [`${require('./aboutus.component.css')}`]
})
export class AboutusComponent implements OnInit {
    
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
