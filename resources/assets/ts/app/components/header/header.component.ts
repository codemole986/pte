import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-header',
    template: require('./header.component.html'),
    styles: [`${require('./header.component.css')}`]
})
export class HeaderComponent implements OnInit {
    pushRightClass: string = 'push-right';

    quizmanageable: boolean;
    examineemanageable: boolean;
    evalmanageable: boolean;
    usermanageable: boolean;
    testmanageable: boolean; 
    exercisemanageable: boolean;

    constructor(private translate: TranslateService, public router: Router) {

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
        
        
        this.usermanageable = false;
        this.quizmanageable = false;
        this.examineemanageable = false; 
        this.evalmanageable = false; 
        this.testmanageable = false; 
        this.exercisemanageable = false;


        if(window.sessionStorage.getItem('permission')=='A') {
            this.usermanageable = true;
            this.quizmanageable = true;
            this.exercisemanageable = true;
            this.testmanageable = true; 
            this.examineemanageable = true;
            this.evalmanageable = true;
        } else if(window.sessionStorage.getItem('permission').indexOf('B')>-1 ) {
            this.quizmanageable = true;
            this.exercisemanageable = true;
            this.testmanageable = true; 
            this.examineemanageable = true;
            this.evalmanageable = true;            
        } else if(window.sessionStorage.getItem('permission').indexOf('C')>-1 ) {
            this.evalmanageable = true;            
        } else if(window.sessionStorage.getItem('permission').indexOf('D')>-1 ) {
            this.quizmanageable = true;
            this.exercisemanageable = true;
            this.examineemanageable = true;
            this.testmanageable = true; 
        } 

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {

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
        window.sessionStorage.removeItem('isLoggedin');
    }

    changeLang(language: string) {        
        this.translate.use(language);
        localStorage.setItem('useLang', language);
        //
    }
}
