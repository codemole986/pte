import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { routerTransition } from '../router.animations';
import { TranslateService } from '@ngx-translate/core';

import { User } from '../model/user'

declare var $:any;
declare var bootbox: any;
declare var Metronic: any;

@Component({
	selector: 'app-login',
	template: require('./login.component.html'),
	styles: [`${require('./login.component.css')}`],
	animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

	httpdata="";
	user: User;
	pass_reset_flag: boolean = false;
	view_flag: boolean = false;

	constructor(private http: Http, private router: Router, private translate: TranslateService) { 
		
	}

  	ngOnInit() {
  		this.pass_reset_flag = false;
  		this.user = new User;
  		this.user.remember = false;
  		Metronic.init();
  		this.view_flag = false;
  	}

  	onClickSubmit(data: User) {
  		if(!this.pass_reset_flag) {
  			this.http.post("/user/login", data).
			map(
				(response) => response.json()
			).
			subscribe(
				(data) => {
					if (data.length == 0) {
						return;
					} else if(data.state == "error") {
						Metronic.showErrMsg(data.message);
					} else {
						window.sessionStorage.setItem("isLoggedin", 'true');
						window.sessionStorage.setItem("userid", data.userinfo.id);
						window.sessionStorage.setItem("_token", data._token);
						window.sessionStorage.setItem('permission', data.userinfo.permission);
						window.sessionStorage.setItem('username', data.userinfo.first_name + ' ' + data.userinfo.last_name);
						window.sessionStorage.setItem('userphoto', data.userinfo.photo);
						
						$('body').removeClass('login');
						this.router.navigate(['dashboard']);					
					}
				}
			);
  		} else {
  			if(data.password!=data.confirmpassword) {
	            this.translate.stream("Diff Your Password and Confirm Password.").subscribe((res: any) => {
	                Metronic.showErrMsg(res);
	            });
	    		return;
	    	}
    	
  			this.http.post("/user/resetpassword", data).
			map(
				(response) => response.json()
			).
			subscribe(
				(data) => {				
					if(data.state == "error") {
						Metronic.showErrMsg(data.message);
					} else {
						this.pass_reset_flag = false;
					}
				}
			);
  		}
  		
	}

	onClickRemember() {
		$('label.checkbox div.checker').toggleClass('focus')
		$('label.checkbox div.checker span').toggleClass('checked')
	}

	onViewReady() {
        if (this.view_flag)
            return;
        $('body').addClass('login');
        this.view_flag = true;
    }
}
