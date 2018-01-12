import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { routerTransition } from '../router.animations';

import { User } from '../model/user'

@Component({
  selector: 'app-manage',
  template: require('./manage.component.html'),
  styles:  [`${require('./manage.component.css')}`],
  animations: [routerTransition()]  
})
export class ManageComponent implements OnInit {
	userlist: User[];
	chgpermission: Boolean;
  	userinfo: User;
  	isStudent = false;
  	isTeacher = false;
  	isChecker = false;
  	isManager = false;

  	constructor(private http: Http, private router: Router) { }

  	ngOnInit() {
  		this.getUsers();
  	}

  	getUsers() {
		this.http.get("/user/getusers").
		map(
			(response) => response.json()
		).
		subscribe(
			(data) => {
				this.userlist = data;
			}
		)
	}

	showAllowPermissionForm(uinfo: User) {
		this.userinfo = new User;
		this.userinfo = uinfo;
		this.chgpermission = true;
		if(uinfo.permission.indexOf('A')!=-1) {
			this.isStudent = true;
			this.isTeacher = true;
			this.isChecker = true;
			this.isManager = true;			
		} else {
			if(uinfo.permission.indexOf('D')!=-1) {
				this.isStudent = true;			
			}
			if(uinfo.permission.indexOf('C')!=-1) {
				this.isTeacher = true;				
			}
			if(uinfo.permission.indexOf('B')!=-1) {
				this.isChecker = true;				
			}
		}
	}

	checkpermission() {
		if(!this.isManager){
			this.isStudent = true;
			this.isTeacher = true;
			this.isChecker = true;
		} else {
			this.isStudent = false;
			this.isTeacher = false;
			this.isChecker = false;
		}
	}

	onClickUpdate() {
		this.userinfo.permission = "";
		if(this.isStudent) {
			this.userinfo.permission += 'D';
		}
		if(this.isTeacher) {
			this.userinfo.permission += 'C';
		}
		if(this.isChecker) {
			this.userinfo.permission += 'B';
		}
		if(this.isManager) {
			this.userinfo.permission = 'A';
		}

    	this.http.post("/user/update", this.userinfo).
    	map(
            (response) => response.json()
        ).
        subscribe(
    		(data) => {
    			alert(data.message);
    			this.getUsers();
    		}
    	);
    }

    onClickDelete(id: number) {
    	if(window.confirm("Delete really?")) {
	    	this.http.get("/user/delete/"+id).
	    	map(
	            (response) => response.json()
	        ).
	        subscribe(
	    		(data) => {
	    			alert(data.message);
	    			this.chgpermission = false;
	    			this.userinfo = new User;
	    			this.isStudent = false;
  					this.isTeacher = false;
  					this.isChecker = false;
  					this.isManager = false;
	    			this.getUsers();
	    		}
	    	);
	    }
    }

}
