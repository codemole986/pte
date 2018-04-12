import { Component, OnInit, OnDestroy, Directive, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { GlobalService } from '../shared/services/global.service';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { routerTransition } from '../router.animations';
import { TranslateService } from '@ngx-translate/core';

import { User } from '../model/user'
import { PermissionRenderComponent } from './permission-render.component';


declare var $:any;
declare var bootbox: any;
declare var Metronic: any;

@Component({
	selector: 'app-manage',
	template: require('./manage.component.html'),
	styles:  [`${require('./manage.component.css')}`],
	animations: [routerTransition()],
	providers: [GlobalService]  
})
export class ManageComponent implements OnInit, OnDestroy {
	
	currentuserid: number;
    user: User;

    permissionNames: any[];
    classNames: any[];
    cmbpermissionNames: any[];

    active_menu: string = "overview";
    usergrid: any;

	constructor(private http: Http, private router: Router, private globalService: GlobalService, private translate: TranslateService) { 
		this.user = new User;
	}

	renderPermission(data: string) {
		var renderValue;
		switch(data) {
	  		case 'A' : renderValue = "Manager"; break;
	  		case 'B' : renderValue = "Teacher"; break;
	  		case 'C' : renderValue = "Evaluator"; break;
	  		case 'D' : renderValue = "Student"; break;
	  		case 'E' : renderValue = "Register"; break;
	  	}
	  	return renderValue;
	}

	ngOnDestroy() {
        $("#searchpermission").data("select2").destroy();
    }

	ngOnInit() {
		switch(window.sessionStorage.getItem('permission')) {
    		case 'A' : this.active_menu = "manage"; break;
			case 'B' : this.active_menu = "teacher"; break;
			case 'D' : this.active_menu = "student"; break;
			default : this.active_menu = "overview";
    	}

		this.permissionNames = this.globalService.permissionNames;
		this.classNames = this.globalService.simpleclassnames;

		var that = this;
		$("#searchpermission").select2({
            allowClear: true,
            width: 130,
            minimumInputLength: 0,
            placeholder: "Select a Role",
            query: function (query: any) {
                var data = {
                    results: that.permissionNames
                };                
                query.callback(data);
            }       
        });

		this.usergrid = $("#usertable").DataTable({
            serverSide: true,
            stateSave: false,

            "ordering": false,
            "info": true,
            "searching": false,  

            "ajax": {
                "type": "GET",
                "async": true,
                "url": "/user/getuserlist", 
                "data": function(d: any) {
                	d.permission = $('#searchpermission').val(); 
                	d.useremail = $('#searchemail').val(); 
                    return d;
                },                   
                "dataSrc": "data",
                "dataType": "json",
                "cache":    false,
            },
            
            columns:[
                {title: "eMail", data:"email"},
                {title: "Name", data:"first_name", render: function(data: any, type: any, row: any) {
						return data+' '+row["last_name"];
					} 
				},
                {title: "Address", data:"address"},
                {title: "Role", data:"permission", class:"center", render: function(data: any, type: any, row: any) {
						for (var i = 0;  i < that.permissionNames.length; i++) {
				            if (that.permissionNames[i].value == data)
				                return that.permissionNames[i].title;
				        }
				        return '';
					} 
				},
                {title: "Class", data:"class", class:"center"},
                {title: "VisitedCount", data:"visited_count",class:"right"},
                {title: "Created", data:"created_at", class:"center", "render": function (data: any) {
                		if(data == '' || data=='null')
                			return '';                		
				        var date = new Date(data);
				        var month: any;
				        month = date.getMonth() + 1;
				        return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
				    }
			    },
                {title: "Updated", data:"updated_at", class:"center", "render": function (data: any) {
                		if(data == '' || data==null)
                			return '';
				        var date = new Date(data);
				        var month: any;
				        month = date.getMonth() + 1;
				        return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
				    }
				}/*,
                {title: "Action", class:"center", render: function(data: any, type: any, row: any){
                	var str_initpwd = '<a href="javascript:;" id="initpwd_'+row.id+'" style="font-size: 18px; margin-right: 5px;"><i class="fa fa-unlock-alt fa-fw"></i></a>';
                	
                	var str_del = '<a href="javascript:;" id="del_'+row.id+'" style="font-size: 18px;"><i class="fa fa-trash-o fa-fw"></i></a>';

                	setTimeout(function(){
	                	$('#initpwd_'+row.id).on('click', function(e:any) {
	                		that.http.get("/user/initpassword/"+row.id).
							map(
								(response) => response.json()
							).
							subscribe(
								(data) => {
								  	if(data.state == "error") {
								    	Metronic.showErrMsg(data.message);
									} else {
										Metronic.showInfoMsg(data.message);
							  		}
								}
							);
	                	});

	                	
	                	$('#del_'+row.id).on('click', function(e:any) {	                		
						 	that.translate.stream("Are you sure you want to delete?").subscribe((res: any) => {
							    bootbox.confirm(res, function(result: any){
								   if(result) {
									that.http.get("/user/delete/"+row.id).
									map(
										 (response) => response.json()
									  ).
									  subscribe(
									  (data) => {
									    if(data.state == "error"){
										 	Metronic.showErrMsg(data.message);
									    }           
									  }
									);
								 } 	    			
							   });
						 	});
	                	});
	                }, 200);
                	return str_initpwd+str_del;
                }},*/
            ], 

            scrollY: false,
            scrollX: false,
            scrollCollapse: false,
            jQueryUI: true,  

            "paging": true,
            "pagingType": "full_numbers",
            "pageLength": 10, 

            dom: "tBirp",
            //firstAjax: false,            
        });

        $('#usertable tbody').on( 'click', 'tr', function () {
			if ( $(this).hasClass('selected') ) {
				$(this).removeClass('selected');
			} else {
				that.usergrid.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
			}
		} );

		$('#usertable tbody').on( 'dblclick', 'tr', function () {
			if ( !$(this).hasClass('selected') ) {				
				that.usergrid.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
			}
			
			var selected_rowdata = that.usergrid.row('.selected').data();
			that.currentuserid = selected_rowdata.id;
			that.user = selected_rowdata;
			$('#user_id').val(that.user.id);
			$('#first_name').val(that.user.first_name);
			$('#last_name').val(that.user.last_name);
			$('#address').val(that.user.address);
			$('#email').val(that.user.email);
			$('#class').val(that.user.class);
			$('#permission').val(that.user.permission);

			$('#usermodal').modal('show');
		} );

		$('#user-submit-btn').on('click', function(e: any) {
			var user = new User;
			user.id = $('#user_id').val();
			user.first_name = $('#first_name').val();
			user.last_name = $('#last_name').val();
			user.address = $('#address').val();
			user.email = $('#email').val();
			user.class = $('#class').val();
			user.permission = $('#permission').val();
			that.onClickSubmit(user);
			$('#usermodal').modal('hide');
			that.usergrid.ajax.reload('', false);
		});

	   Metronic.init();
	}

	searchUserList(){
        this.usergrid.ajax.reload('', false);             
    };

	initUserPassword() {      
	 if(this.currentuserid == null || this.currentuserid == 0) {
	   this.translate.stream("Select User row.").subscribe((res: any) => {
		  Metronic.showWarnMsg(res);
	   });
	   return;
	 } else {
	 	var that = this;
		this.http.get("/user/initpassword/"+this.currentuserid).
			map(
				(response) => response.json()
			).subscribe((data) => {
				if(data.state == "error") {
			    	Metronic.showErrMsg(data.message);
				} else {
					Metronic.showInfoMsg(data.message);
		  		}
			});       
		}
    }

    onClickSubmit(data: User) {
        var that = this;
        this.http.post("/user/update", data).
		map(
			(response) => response.json()
		).
		subscribe(
			(data) => {				
				if(data.state == "error") {
                    Metronic.showErrMsg(data.message);
				} else {
					that.usergrid.ajax.reload('', false);      
				}
			}
		);
    }


	

}
