import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { GlobalService } from '../shared/services/global.service';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { routerTransition } from '../router.animations';

import { User } from '../model/user'
import { PermissionRenderComponent } from './permission-render.component';

@Component({
  	selector: 'app-manage',
  	template: require('./manage.component.html'),
  	styles:  [`${require('./manage.component.css')}`],
  	animations: [routerTransition()],
	providers: [GlobalService]  
})
export class ManageComponent implements OnInit {
	
  	gridsettings: any;
    userdatasource: LocalDataSource;

    currentuserid: number;

    permissionNames: any[];
    classNames: any[];


  	constructor(private http: Http, private router: Router, private globalService: GlobalService) { }

  	ngOnInit() {
  	
  		this.permissionNames = this.globalService.permissionNames;
  		this.classNames = this.globalService.simpleclassnames;

  		//this.userdatasource = new ServerDataSource(this.http, { totalKey: "total", dataKey: "data", endPoint: '/user/getuserlist' });
  		this.getUserlist();

  		this.gridsettings = {
            mode: 'inline',
            selectMode: 'single',
            hideHeader: false,
            hideSubHeader: true,
            actions: {
                columnTitle: '',
                add: false,
                edit: true,
                'delete': true,                
                position: 'left'
            },             
            filter: {
                inputClass: '',
            },
            edit: {
                inputClass: '',
                editButtonContent: 'Edit',
                saveButtonContent: 'Update',
                cancelButtonContent: 'Cancel',
                confirmSave: true,
            },
            delete: {
                deleteButtonContent: 'Delete',
                confirmDelete: true,
            },
            attr: {
                id: 'usergrid',
                class: 'table table-bordered table-hover table-striped',
            },
            noDataMessage: 'No data found',            
            pager: {
                display: true,
                perPage: 15,
            },
            columns: {                
                name: {
                    title: 'Full Name'
                },                               
                email: {
                    title: 'Email'
                },
                permission: {
                    title: 'Permission',
                    type: 'custom',
                    renderComponent: PermissionRenderComponent,
                    editor: {
                      type: 'list',
                      config: {
                        list: this.permissionNames,
                      },
                    }
                },
                class: {
                    title: 'Class',
                    editor: {
                      type: 'list',
                      config: {
                        list: this.classNames,
                      },
                    }
                },
                created_at: {
                    title: 'Reg. Date',
                    editable: false
                }
            }
        };
  	}

  	getUserlist() {
  		this.http.get("/user/getusers").
    	map(
        (response) => response.json()
      ).
      subscribe(
  		  (data) => {
  			 this.userdatasource = new LocalDataSource(data);
  		  }
    	);    	      
  	}

    onUserRowSelect(event: any) {
        if(this.currentuserid == event.data.id) {
            this.currentuserid = 0;
        } else {
            this.currentuserid = event.data.id;
        }
    }

    initUserPassword() {
      if(this.currentuserid == null || this.currentuserid == 0) {
        window.alert("Select User row.");
        return;
      } else {
        this.http.get("/user/initpassword/"+this.currentuserid).
        map(
          (response) => response.json()
        ).
        subscribe(
          (data) => {
            if(data.state == "error") {
              alert(data.message);
            }
          }
        );       
      }
    }

  	onSaveConfirm(event: any) {
        if (window.confirm('Are you sure you want to save?')) {            
          this.http.post("/user/update", event.newData).
  	    	map(
  	            (response) => response.json()
  	        ).
  	        subscribe(
  	    		(data) => {  	    			
              if(data.state == "success"){
  	    			  event.confirm.resolve(event.newData);      
              } else {
                alert(data.message);
              }
  	    		}
  	    	);    	                            
        } else {
            event.confirm.reject();
        }
    }

    onDeleteConfirm(event: any) {
    	if (window.confirm('Are you sure you want to delete?')) {
	    	this.http.get("/user/delete/"+event.data.id).
	    	map(
	            (response) => response.json()
	        ).
	        subscribe(
	    		(data) => {
	    			if(data.state == "success"){
              event.confirm.resolve();
            } else {
              alert(data.message);
            }	    			
	    		}
	    	);
	    } else {
            event.confirm.reject();
        }
    }

  	

}
