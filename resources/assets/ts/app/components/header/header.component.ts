import { Component, OnInit, Input, } from '@angular/core';
import { Router, NavigationEnd, ResolveEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';

import { AuthService } from './../../shared';

declare var $:any;

@Component({
    selector: 'app-header',
    template: require('./header.component_overview.html'),
    styles: [`${require('./header.component.css')}`]
})
export class HeaderComponent implements OnInit {

    pushRightClass: string = 'push-right';

    menu_home: boolean;
    menu_aboutus: boolean;
    menu_contactus: boolean;
    user_name: string;
    user_id: string;
    user_photo: string;

    _defaultmenu: string;
    
    langflag: string;

    constructor(private http: Http, public translate: TranslateService, public router: Router, private authService: AuthService) {
        this.translate.addLangs(['en', 'zh']);
        this.translate.setDefaultLang('en');
        //const browserLang = this.translate.getBrowserLang();
        const browserLang = localStorage.getItem('useLang');
        if(browserLang == null) {
            localStorage.setItem('useLang', 'en');
            this.translate.use(this.translate.getDefaultLang());
        } else {
            this.translate.use(browserLang.match(/en|zh/) ? browserLang : 'en');
        }
        
        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }

            if (val instanceof ResolveEnd) {
                $('.menu-dropdown.mega-menu-dropdown.mega-menu-full.open .dropdown-toggle.hover-initialized').attr('aria-expanded', 'false');
                $('.menu-dropdown.mega-menu-dropdown.mega-menu-full.open').removeClass('open');
            }
        });
    }

    ngOnInit() {
        var language = localStorage.getItem('useLang');
        if (language == 'en')
            this.langflag = 'en';
        else if (language == 'zh')
            this.langflag = 'cn';
        else
            this.langflag = 'en';
        
        this.user_name =  window.sessionStorage.getItem('username');
        this.user_id =  window.sessionStorage.getItem('userid');
        this.user_photo =  window.sessionStorage.getItem('userphoto');
    }

    

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        this.authService.logout();
    }

    onLogin() {
        this.authService.login();
    }

    onSignUp() {
        this.authService.signup();
    }

    changeLang(language: string) {
        this.translate.use(language);
        localStorage.setItem('useLang', language);
        if (language == 'en')
            this.langflag = 'en';
        else if (language == 'zh')
            this.langflag = 'cn';
        else
            this.langflag = 'en';
    }

    changeMenu() {

    }
}

@Component({
    selector: 'app-header-overview',
    template: require('./header.component_overview.html'),
    styles: [`${require('./header.component.css')}`],    
})
export class HeaderOverviewComponent extends HeaderComponent implements OnInit { 
	@Input() default: string;
}

@Component({
    selector: 'app-header-student',
    template: require('./header.component_student.html'),
    styles: [`${require('./header.component.css')}`],    
})
export class HeaderStudentComponent extends HeaderComponent implements OnInit { 
	@Input() default: string;
}

@Component({
    selector: 'app-header-teacher',
    template: require('./header.component_teacher.html'),
    styles: [`${require('./header.component.css')}`],    
})
export class HeaderTeacherComponent extends HeaderComponent implements OnInit { 
	@Input() default: string;
}

@Component({
    selector: 'app-header-manage',
    template: require('./header.component_manage.html'),
    styles: [`${require('./header.component.css')}`],    
})
export class HeaderManageComponent extends HeaderComponent implements OnInit { 
	@Input() default: string;
}

