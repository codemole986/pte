import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import {Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { User } from '../model/user';
import { GlobalService } from '../shared/services/global.service';
import { routerTransition } from '../router.animations';

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
    
    constructor(private http: Http, private router: Router, private globalService: GlobalService) { 
        this.user = new User;
    }

    ngOnInit() {
        this.class = this.globalService.classnames;
        this.user.class = "";
    }

    onClickSubmit(data: User) {
        
        if(data.name==null) {
    		return false;
    	}

    	if(data.email==null) {
    		return;
    	}

    	if(data.password==null) {
    		alert("Input Your Password.");
    		return;
    	}

    	if(data.confirmpassword==null) {
    		alert("Input Your Repeat Password.");
    		return;
    	}

    	if(data.password!=data.confirmpassword) {
    		alert("Diff Your Password and Repeat Password.");
    		return;
    	}

        if(data.class=="") {
            alert("Select User Class");
            return;
        }

        this.http.post("/user/register", data).
			map(
				(response) => response.json()
			).
			subscribe(
				(data) => {				
					if(data.state == "fail") {
                        alert(data.message);
					} else {
						// redirect login
						this.router.navigate(['/login']);
					}
				}
			)
    }
}
