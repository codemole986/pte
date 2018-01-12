import { Component, OnInit } from '@angular/core';

import {Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { User } from '../model/user';

@Component({
    selector: 'app-signup',
    template: require('./signup.component.html'),
	styles: [`${require('./signup.component.css')}`]  
    
})
export class SignupComponent implements OnInit {
    
    httpdata="";

    constructor(private http: Http) { }

    ngOnInit() {}

    onClickSubmit(data: User) {
    	if(data.name=='') {
    		alert("Input Your Name.");
    		return;
    	}

    	if(data.email=='') {
    		alert("Input Your Email Address.");
    		return;
    	}

    	if(data.password=='') {
    		alert("Input Your Password.");
    		return;
    	}

    	if(data.confirmpassword=='') {
    		alert("Input Your Repeat Password.");
    		return;
    	}

    	if(data.password!=data.confirmpassword) {
    		alert("Diff Your Password and Repeat Password.");
    		return;
    	}

        this.http.post("/user/register", data).
			map(
				(response) => response.json()
			).
			subscribe(
				(data) => {				
					if(data.state = "fail") {
						alert(data.message);
					} else {
						// redirect dashboard
					}
				}
			)
    }
}
