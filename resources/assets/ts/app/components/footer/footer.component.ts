import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    template: require('./footer.component.html'),
    styles: [`${require('./footer.component.css')}`]
})
export class FooterComponent implements OnInit {
    
    constructor(private translate: TranslateService, public router: Router) {

    }

    ngOnInit() {
    }
}
