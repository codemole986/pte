import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { routerTransition } from '../router.animations';

import { User } from '../model/user'

@Component({
	selector: 'app-login',
	template: require('./login.component.html'),
	styles: [`${require('./login.component.css')}`],
	animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

	httpdata="";
	user=new User;

	constructor(private http: Http, private router: Router) { 
		
	}

  	ngOnInit() {

  	}

  	onClickSubmit(data: User) {
  		if( data.email =='') {
  			alert("Enter Your Email.");
  			return;
  		}
  		if(data.password=='') {
  			alert("Enter Password.");
  			return;
  		}
		
		this.http.post("/user/login", data).
		map(
			(response) => response.json()
		).
		subscribe(
			(data) => {				
				if(data.state == "fail") {
					alert(data.message);
				} else {
					localStorage.setItem('isLoggedin', 'true');
					localStorage.setItem('permission', data.userinfo.permission);
					
					this.router.navigate(['dashboard']);
					
				}
			}
		);
	}
}
