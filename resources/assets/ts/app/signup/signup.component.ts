import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import {Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { User } from '../model/user';
import { GlobalService } from '../shared/services/global.service';
import { routerTransition } from '../router.animations';
import { TranslateService } from '@ngx-translate/core';

declare var $:any;
declare var bootbox: any;
declare var Metronic: any;

@Component({
    selector: 'app-signup',
    template: require('./signup.component.html'),
	styles: [`${require('./signup.component.css')}`],
    animations: [routerTransition()],
    providers: [GlobalService]
})
export class SignupComponent implements OnInit {
    
    httpdata="";
    class: any[];
    user: User;

    verifyflag: boolean = false;
    username: string = "";
    code: string = "";
    view_flag: boolean = false;
    
    constructor(private http: Http, private router: Router, private globalService: GlobalService, private translate: TranslateService) { 
        this.user = new User;
    }

    ngOnInit() {
        this.class = this.globalService.classnames;
        this.user.class = "";

        Metronic.init();
        this.view_flag = false;
    }

    onClickSubmit(data: User) {
        
        if(data.password!=data.confirmpassword) {
            this.translate.stream("Diff Your Password and Confirm Password.").subscribe((res: any) => {
                Metronic.showErrMsg(res);
            });
    		return;
    	}

        this.http.post("/user/register", data).
			map(
				(response) => response.json()
			).
			subscribe(
				(data) => {				
					if(data.state == "error") {
                        Metronic.showErrMsg(data.message);
					} else {
						// redirect login
						//this.router.navigate(['/login']);
                        this.verifyflag = true;
                        this.username = data.name;
                        this.code = data.code;
					}
				}
			);
    }

    onClickVerify(code: string) {
        this.http.get("/user/verifycode/"+code).
            map(
                (response) => response.json()
            ).
            subscribe(
                (data) => {             
                    if(data.state == "error") {
                        Metronic.showErrMsg(data.message);
                    } else {
                        // redirect login
                        $('body').removeClass('login');
                        this.router.navigate(['/login']);
                    }
                }
            )
    }

    onViewReady() {
        if (this.view_flag)
            return;
        $('body').addClass('login');
        this.view_flag = true;
    }
}
