import { Component, OnInit, Input  } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';

import { Userprofile } from '../../model/userprofile'

declare var $:any;
declare var bootbox: any;
declare var Metronic: any;
declare var Dropzone: any;


@Component({
    selector: 'app-profile',
    template: require('./profile.component.html'),
    styles: [`${require('./profile.component.css')}`]
})
export class ProfileComponent implements OnInit {
    
    active_menu: string = "overview";

    psvisitedcount: number = 1342;
    
    psanswerquizcount: number = 2342;
    psanswercount: number = 32342;

    psquizcount: number = 523;

    username : string = "John Doe";
    aboutuser: string = "Lorem ipsum dolor sit amet diam nonummy nibh dolore."; 
    usersiteurl: string = "www.keenthemes.com";

    userself: Userprofile;
    
    thisDropzone: any;
    _stoken: string;

    constructor(private http: Http, private translate: TranslateService, public router: Router) {
        Dropzone.autoDiscover = false;
        this.userself = new Userprofile;
        if(this._stoken==null) {
            this._stoken = window.sessionStorage.getItem("_token");
        }
    }

    ngOnInit() {
    	switch(window.sessionStorage.getItem('permission')) {
    		case 'A' : this.active_menu = "manage"; break;
			case 'B' : this.active_menu = "teacher"; break;
			case 'D' : this.active_menu = "student"; break;
			default : this.active_menu = "overview";
    	}

        this.http.get("/user/getuserprofile").
        map(
            (response) => response.json()
        ).
        subscribe(
            (data) => {
                if(data.state == "error") {
                    Metronic.showErrMsg(data.message);
                } else {
                    this.userself = data.info;
                    this.userself.password = ''; 
                    this.userself.username = this.userself.first_name + " " + this.userself.last_name;                              
                }
            }
        );

        this.http.get("/welcome/getstatisticsdata").
        map(
            (response) => response.json()
        ).
        subscribe(
            (data) => {
                this.psvisitedcount = !isNaN(Number(data["psvisitedcount"]).valueOf())?Number(data["psvisitedcount"]).valueOf():0;
            }
        );

        if (this.thisDropzone) {
            this.thisDropzone.destroy();
        }
        this.create_dropzone();

    }

    saveprofile(data: Userprofile) {
        var user_data = data;
        this.http.post("/user/saveuserprofile", data).
        map(
            (response) => response.json()
        ).
        subscribe(
            (data) => {             
                if(data.state == "error") {
                    Metronic.showErrMsg(data.message);
                } else {
                    window.sessionStorage.setItem('username', user_data.first_name + ' ' + user_data.last_name);
                    this.router.navigate(['/dashboard']);
                }
            }
        );
    }

    create_dropzone() {
        setTimeout(() => {            
            try {
                this.thisDropzone = new Dropzone('#dzavatarfile', {
                    url: '/user/uploadphotofile',
                    addRemoveLinks: true,
                    uploadMultiple: false,
                    autoQueue: false,
                    maxFilesize: 5,                    
                    params: {_token: this._stoken}
                });
            } catch(e) {
                console.log(e);
            }
            this.thisDropzone.options.acceptedFiles = "image/jpeg, images/jpg, image/png";
        }, 200);
    }

    uploadavatarfile() {
        if(this.thisDropzone.files.length>0) {
            this.userself.photo = this.thisDropzone.files[0].name;     
        } 

        if(this.thisDropzone && this.thisDropzone.files.length>0) {
            this.thisDropzone.uploadFiles(this.thisDropzone.files);
        };

        window.sessionStorage.setItem('userphoto', this.userself.photo);
        this.router.navigate(['/dashboard']);
    }

    changepwd(data: Userprofile) {
        if(data.password!=data.confirmpassword) {
            this.translate.stream("Diff Your Password and Re-Type Password.").subscribe((res: any) => {
                Metronic.showErrMsg(res);
            });
            return;
        }

        this.http.post("/user/changepassword", data).
            map(
                (response) => response.json()
            ).
            subscribe(
                (data) => {             
                    if(data.state == "error") {
                        Metronic.showErrMsg(data.message);
                    } else {
                        Metronic.showSuccessMsg(data.message);
                    }
                }
            );
        
    }
}
