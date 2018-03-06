import { Component, OnInit, AfterViewInit, Directive, OnDestroy, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { routerTransition } from '../router.animations';
import { GlobalService } from '../shared/services/global.service';
import { Problem } from '../model/problem';
import { Testevent } from '../model/testevent';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { FileUploadDirective } from './file-upload.directive';
import { TranslateService } from '@ngx-translate/core';

declare var $:any;
declare var angular:any;
declare var Dropzone: any;
declare var bootbox: any;
declare var Metronic: any;
declare var DataTable: any;

@Component({
    selector: 'app-dashboard',
    template: require('./dashboard.component.html'),
    styles: [`${require('./dashboard.component.css')}`],
    animations: [routerTransition()],
    providers: [GlobalService]
})


export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];

    active_dashboard: string = "overview";

    testgridsettings: any;
    testdatasource: ServerDataSource;
    curselectedtestid: number;
    curevent_id: number;
    curtestevent_info: Testevent;

    curselectedquizid: number;
    quizgridsettings: any;
    quizdatasource: ServerDataSource;

    curselectedexerciseid: number;
    exercisegridsettings: any;
    exercisedatasource: ServerDataSource;
    
    examgridsettings: any;
    examdatasource: ServerDataSource;
    
    arr_types: any[];
    i: number;
    charttype: String;
    chartdata: any;
    charttype2: String;
    chartdata2: any;
    chartoptions: any;

    psvisitedcount: number = 1342;
    pshonourcount: number = 567;
    pspassrate: number = 65.4;
    psexercisecount: number = 13123;
    psexquizcount: number = 345;
    psrank: number = 5;

    psuploadedproblemcount: number = 24567;
    psacceptedproblemcount: number = 18766;
    psacceptedpercent: number = 75.3;

    totalstudentcount: number = 168492342;
    totalteachercount: number = 2346;
    honourstudentcount: number = 1127390;
    passrate: number = 45.4;
    answercount: number = 2314560976;
    uploadedproblemcount: number = 35467345;

    constructor(private http: Http, private router: Router, private globalService: GlobalService, private translate: TranslateService) {
        this.sliders.push(
            {
                imagePath: 'assets/images/slider1.jpg',
                label: 'First slide label',
                text:
                    'Nulla vitae elit libero, a pharetra augue mollis interdum.'
            },
            {
                imagePath: 'assets/images/slider2.jpg',
                label: 'Second slide label',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            },
            {
                imagePath: 'assets/images/slider3.jpg',
                label: 'Third slide label',
                text:
                    'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
            }
        );
    }
    
    ngOnInit() {
    	
    	switch(window.sessionStorage.getItem('permission')) {
    		case 'A' : this.active_dashboard = "manage"; break;
			case 'B' : this.active_dashboard = "teacher"; break;
			case 'D' : this.active_dashboard = "student"; break;
			default : this.active_dashboard = "overview";
    	}

        Metronic.init();    
        
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    getTypes(category: string) {
        return this.globalService.problemTypes[category];
    }

    getTypeName(category: string, value: string) {
        this.arr_types = this.getTypes(category);
        for (this.i = 0;  this.i < this.arr_types.length; this.i++) {
            if (this.arr_types[this.i].value == value)
                return this.arr_types[this.i].title;
        }
        return '';
    }

}

@Component({
    selector: 'app-teacher-component',
    template: require('./dashboard.component_teacher.html'),
    styles: [`${require('./dashboard.component.css')}`],
    animations: [routerTransition()],
    providers: [GlobalService]
})
export class TeacherComponent extends DashboardComponent implements OnInit { 
	constructor(private http1: Http, private router1: Router, private globalService1: GlobalService, private translate1: TranslateService) {	
		super(http1, router1, globalService1, translate1); 
	}	

    ngOnInit() {
        
        this.http1.get("/welcome/getstatisticsdata").
        map(
            (response) => response.json()
        ).
        subscribe(
            (data) => {
                this.psacceptedproblemcount = !isNaN(Number(data["psacceptedproblemcount"]).valueOf())?Number(data["psacceptedproblemcount"]).valueOf():0;
                this.psacceptedpercent = !isNaN(Number(data["psacceptedpercent"]).valueOf())?Number(data["psacceptedpercent"]).valueOf():0;
                this.psuploadedproblemcount = !isNaN(Number(data["psuploadedproblemcount"]).valueOf())?Number(data["psuploadedproblemcount"]).valueOf():0;
                this.psrank = !isNaN(Number(data["psrank"]).valueOf())?Number(data["psrank"]).valueOf():0; 
            }
        );

        var writingquizgrid = $("#writinghistorytable").DataTable({
            serverSide: true,
            stateSave: false,

            "ordering": false,
            "info": true,
            "searching": true,  

            "ajax": {
                "type": "GET",
                "async": false,
                "url": "/problem/getsimpleproblems",
                "data": {category: 'Writing', cond:'person'},     
                "dataSrc": "data",
                "dataType": "json",
                "cache":    false,
            },
            
            columns:[
                {title: "Title", data:"title"},
                {title: "Limit Time", data:"limit_time", "class": "right", width:105, "visible": true},
                //{title: "Points", data:"points"},
                {title: "Date", data:"created_at"},
            ], 

            scrollY: false,
            scrollX: false,
            scrollCollapse: false,
            jQueryUI: true,  
            dom: "tsB",
            //firstAjax: false,            
        });

        var listeningquizgrid = $("#listeninghistorytable").DataTable({
            serverSide: true,
            stateSave: false,

            "ordering": false,
            "info": true,
            "searching": true,  

            "ajax": {
                "type": "GET",
                "async": false,
                "url": "/problem/getsimpleproblems",
                "data": {category: 'Listening', cond:'person'},     
                "dataSrc": "data",
                "dataType": "json",
                "cache":    false,
            },
            
            columns:[
                {title: "Title", data:"title"},
                {title: "Limit Time", data:"limit_time", "class": "right", width:105, "visible": true},
                //{title: "Points", data:"points"},
                {title: "Date", data:"created_at"},
            ], 

            scrollY: false,
            scrollX: false,
            scrollCollapse: false,
            jQueryUI: true,  
            dom: "tsB",
            //firstAjax: false,            
        });

        var readingquizgrid = $("#readinghistorytable").DataTable({
            serverSide: true,
            stateSave: false,

            "ordering": false,
            "info": true,
            "searching": true,  

            "ajax": {
                "type": "GET",
                "async": false,
                "url": "/problem/getsimpleproblems",
                "data": {category: 'Reading', cond:'person'},     
                "dataSrc": "data",
                "dataType": "json",
                "cache":    false,
            },
            
            columns:[
                {title: "Title", data:"title"},
                {title: "Limit Time", data:"limit_time", "class": "right", width:105, "visible": true},
                //{title: "Points", data:"points"},
                {title: "Date", data:"created_at"},
            ], 

            scrollY: false,
            scrollX: false,
            scrollCollapse: false,
            jQueryUI: true,  
            dom: "tsB",
            //firstAjax: false,            
        });

        var speakingquizgrid = $("#speakinghistorytable").DataTable({
            serverSide: true,
            stateSave: false,

            "ordering": false,
            "info": true,
            "searching": true,  

            "ajax": {
                "type": "GET",
                "async": false,
                "url": "/problem/getsimpleproblems",
                "data": {category: 'Speaking', cond:'person'},     
                "dataSrc": "data",
                "dataType": "json",
                "cache":    false,
            },
            
            columns:[
                {title: "Title", data:"title"},
                {title: "Limit Time", data:"limit_time", "class": "right", width:105, "visible": true},
                //{title: "Points", data:"points"},
                {title: "Date", data:"created_at"},
            ], 

            scrollY: false,
            scrollX: false,
            scrollCollapse: false,
            jQueryUI: true,  
            dom: "tsB",
            //firstAjax: false,            
        });

        var topteachergrid = $("#topteachertable").DataTable({
            serverSide: true,
            stateSave: false,

            "ordering": false,
            "info": true,
            "searching": true,  

            "ajax": {
                "type": "GET",
                "async": false,
                "url": "/user/getusersimplelist",
                "data": {permission: 'B'},     
                "dataSrc": "data",
                "dataType": "json",
                "cache":    false,
            },
            
            columns:[
                {title: "Name", data:"first_name", render: function(data: any, type: any, row: any) {
                        return data+' '+row["last_name"];
                    } 
                },
                {title: "Problem Count", data:"problemcount", class: "right"},
                {title: "Pass Problems", data:"passcount", class: "right"},
                {title: "Pass Rate", data:"passrate", class: "right"},
            ], 

            scrollY: false,
            scrollX: false,
            scrollCollapse: false,
            jQueryUI: true,  
            dom: "tsB",
            //firstAjax: false,            
        }); 
    }
}

@Component({
    selector: 'app-overview-component',
    template: require('./dashboard.component_overview.html'),
    styles: [`${require('./dashboard.component.css')}`],
    animations: [routerTransition()],
    providers: [GlobalService]
})
export class OverviewComponent extends DashboardComponent implements OnInit { 
	constructor(private http1: Http, private router1: Router, private globalService1: GlobalService, private translate1: TranslateService) {	
		super(http1, router1, globalService1, translate1); 
    }

    ngOnInit() {
        
        this.http1.get("/welcome/getstatisticsdata").
        map(
            (response) => response.json()
        ).
        subscribe(
            (data) => {
                this.totalstudentcount = !isNaN(Number(data["totalstudentcount"]).valueOf())?Number(data["totalstudentcount"]).valueOf():0;
                this.honourstudentcount = !isNaN(Number(data["honourstudentcount"]).valueOf())?Number(data["honourstudentcount"]).valueOf():0;
                this.pspassrate = !isNaN(Number(data["pspassrate"]).valueOf())?Number(data["pspassrate"]).valueOf():0;
                this.answercount = !isNaN(Number(data["answercount"]).valueOf())?Number(data["answercount"]).valueOf():0;
                this.uploadedproblemcount = !isNaN(Number(data["uploadedproblemcount"]).valueOf())?Number(data["uploadedproblemcount"]).valueOf():0;
            }
        );

            var topstudentsgrid = $("#topstudentstable").DataTable({
                serverSide: true,
                stateSave: false,

                "ordering": false,
                "info": true,
                "searching": true,  

                "ajax": {
                    "type": "GET",
                    "async": false,
                    "url": "/user/getusersimplelist",
                    "data": {permission: 'D'},     
                    "dataSrc": "data",
                    "dataType": "json",
                    "cache":    false,
                },
                columns:[
                    //{title: "ID", data:"id"}, 
                    {title: "Name", data:"first_name", render: function(data: any, type: any, row: any) {
                            return data+' '+row["last_name"];
                        } 
                    },
                    {title: "Login Times", data:"visited_count", class: "right"},
                    {title: "Exercise Times", data:"anscount", class: "right"},
                    //{title: "Avg Mark", data:"avgmark", class: "right"},
                ], 

                scrollY: false,
                scrollX: false,
                scrollCollapse: false,
                jQueryUI: true,  
                dom: "tB",
                //firstAjax: false,            
            });            
            
            var topteachergrid = $("#topteachertable").DataTable({
                serverSide: true,
                stateSave: false,

                "ordering": false,
                "info": true,
                "searching": true,  

                "ajax": {
                    "type": "GET",
                    "async": false,
                    "url": "/user/getusersimplelist",
                    "data": {permission: 'B'},     
                    "dataSrc": "data",
                    "dataType": "json",
                    "cache":    false,
                },
                
                columns:[
                    {title: "Name", data:"first_name", render: function(data: any, type: any, row: any) {
                            return data+' '+row["last_name"];
                        } 
                    },
                    {title: "Login Times", data:"visited_count", class: "right"},
                    {title: "Problem Count", data:"problemcount", class: "right"},
                    {title: "Pass Problems", data:"passcount", class: "right"},
                ], 

                scrollY: false,
                scrollX: false,
                scrollCollapse: false,
                jQueryUI: true,  
                dom: "tsB",
                //firstAjax: false,            
            }); 

            var writingquizgrid = $("#writingquiztable").DataTable({
                serverSide: true,
                stateSave: false,

                "ordering": false,
                "info": true,
                "searching": true,  

                "ajax": {
                    "type": "GET",
                    "async": false,
                    "url": "/problem/getsimpleproblems",
                    "data": {category: 'Writing'},     
                    "dataSrc": "data",
                    "dataType": "json",
                    "cache":    false,
                },
                
                columns:[
                    //{title: "ID", data:"id", "visible": false}, 
                    {title: "Title", data:"title"},
                    {title: "Limit Time", data:"limit_time", "class": "right", width:105, "visible": true},
                    //{title: "Points", data:"points"},
                ], 

                scrollY: false,
                scrollX: false,
                scrollCollapse: false,
                jQueryUI: true,  
                dom: "tsB",
                //firstAjax: false,            
            });

            var listeningquizgrid = $("#listeningquiztable").DataTable({
                serverSide: true,
                stateSave: false,

                "ordering": false,
                "info": true,
                "searching": true,  

                "ajax": {
                    "type": "GET",
                    "async": false,
                    "url": "/problem/getsimpleproblems",
                    "data": {category: 'Listening'},     
                    "dataSrc": "data",
                    "dataType": "json",
                    "cache":    false,
                },
                
                columns:[
                    //{title: "ID", data:"id", "visible": false}, 
                    {title: "Title", data:"title"},
                    {title: "Limit Time", data:"limit_time", "class": "right", width:105, "visible": true},
                    //{title: "Points", data:"points"},
                ], 

                scrollY: false,
                scrollX: false,
                scrollCollapse: false,
                jQueryUI: true,  
                dom: "tsB",
                //firstAjax: false,            
            });

            var readingquizgrid = $("#readingquiztable").DataTable({
                serverSide: true,
                stateSave: false,

                "ordering": false,
                "info": true,
                "searching": true,  

                "ajax": {
                    "type": "GET",
                    "async": false,
                    "url": "/problem/getsimpleproblems",
                    "data": {category: 'Reading'},     
                    "dataSrc": "data",
                    "dataType": "json",
                    "cache":    false,
                },
                
                columns:[
                    //{title: "ID", data:"id", "visible": false}, 
                    {title: "Title", data:"title"},
                    {title: "Limit Time", data:"limit_time", "class": "right", width:105, "visible": true},
                    //{title: "Points", data:"points"},
                ], 

                scrollY: false,
                scrollX: false,
                scrollCollapse: false,
                jQueryUI: true,  
                dom: "tsB",
                //firstAjax: false,            
            });

            var speakingquizgrid = $("#speakingquiztable").DataTable({
                serverSide: true,
                stateSave: false,

                "ordering": false,
                "info": true,
                "searching": true,  

                "ajax": {
                    "type": "GET",
                    "async": false,
                    "url": "/problem/getsimpleproblems",
                    "data": {category: 'Speaking'},     
                    "dataSrc": "data",
                    "dataType": "json",
                    "cache":    false,
                },
                
                columns:[
                    //{title: "ID", data:"id", "visible": false}, 
                    {title: "Title", data:"title"},
                    {title: "Limit Time", data:"limit_time", class: "right", width:105, "visible": true},
                    //{title: "Points", data:"points"},
                ], 

                scrollY: false,
                scrollX: false,
                scrollCollapse: false,
                jQueryUI: true,  
                dom: "tsB",
                //firstAjax: false,            
            });

        this.charttype = 'bar';
        this.chartdata = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            
            datasets: [
                {
                    label: "Quiz Count",              
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: 'rgba(75, 192, 132, 0.2)',
                    borderColor:'rgba(75, 192, 132, 1)',
                    borderWidth: 1            
                },
                {
                    label: "Exercise Count",
                    data: [15, 79, 60, 91, 65, 75, 30],
                    backgroundColor: 'rgba(0, 75, 255, 0.2)',
                    borderColor: 'rgba(0, 132, 255, 1)',
                    borderWidth: 1
                }
            ]
        };
        this.chartoptions = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgb(99, 99, 216)'
                }
            }
        };

        this.charttype2 = 'line';
        this.chartdata2 = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            
            datasets: [
                {
                    label: "Max",              
                    data: [65, 59, 80, 81, 86, 75, 90],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor:'rgba(75, 192, 192, 1)',
                    borderWidth: 1            
                }
            ]
        };
        
	}
}

@Component({
    selector: 'app-student-component',
    template: require('./dashboard.component_student.html'),
    styles: [`${require('./dashboard.component.css')}`],
    animations: [routerTransition()],
    providers: [GlobalService]
})
export class DashStudentComponent extends DashboardComponent implements OnInit { 
	constructor(private http1: Http, private router1: Router, private globalService1: GlobalService, private translate1: TranslateService) {	
		super(http1, router1, globalService1, translate1); 
    }

    ngOnInit() {
        this.http1.get("/welcome/getstatisticsdata").
        map(
            (response) => response.json()
        ).
        subscribe(
            (data) => {
                this.psvisitedcount = !isNaN(Number(data["psvisitedcount"]).valueOf())?Number(data["psvisitedcount"]).valueOf():0;
                this.psexercisecount = !isNaN(Number(data["psexercisecount"]).valueOf())?Number(data["psexercisecount"]).valueOf():0;
                this.psexquizcount = !isNaN(Number(data["psexquizcount"]).valueOf())?Number(data["psexquizcount"]).valueOf():0;
                this.psrank = !isNaN(Number(data["psrank"]).valueOf())?Number(data["psrank"]).valueOf():0;
            }
        );

        var topmembergrid = $("#topmemberstudentslist").DataTable({
                serverSide: true,
                stateSave: false,

                "ordering": false,
                "info": true,
                "searching": true,  

                "ajax": {
                    "type": "GET",
                    "async": false,
                    "url": "/user/getusersimplelist",
                    "data": {permission: 'D'},     
                    "dataSrc": "data",
                    "dataType": "json",
                    "cache":    false,
                },
                
                columns:[
                    //{title: "ID", data:"id"}, 
                    {title: "Name", data:"first_name", render: function(data: any, type: any, row: any) {
                            return data+' '+row["last_name"];
                        } 
                    },
                    {title: "Login Times", data:"visited_count", class: "right"},
                    {title: "Exercise Times", data:"anscount", class: "right"},
                    //{title: "Avg Mark", data:"avgmark", class: "right"},
                ], 

                scrollY: false,
                scrollX: false,
                scrollCollapse: false,
                jQueryUI: true,  
                dom: "tB",
                //firstAjax: false,            
            });            
            
            var writinghistorygrid = $("#writinghistorytable").DataTable({
                serverSide: true,
                stateSave: false,

                "ordering": false,
                "info": true,
                "searching": true,  

                "ajax": {
                    "type": "GET",
                    "async": false,
                    "url": "/answer/getsimpleexerciseanswers",
                    "data": {category: 'Writing'},     
                    "dataSrc": "data",
                    "dataType": "json",
                    "cache":    false,
                },
                
                columns:[
                    //{title: "ID", data:"id", "visible": false}, 
                    {title: "Title", data:"title"},
                    {title: "Limit Time", data:"limit_time", "class": "right", width:105, "visible": true},
                    //{title: "Points", data:"points"},
                ], 

                scrollY: false,
                scrollX: false,
                scrollCollapse: false,
                jQueryUI: true,  
                dom: "tB",
                //firstAjax: false,            
            });

            var listeninghistorygrid = $("#listeninghistorytable").DataTable({
                serverSide: true,
                stateSave: false,

                "ordering": false,
                "info": true,
                "searching": true,  

                "ajax": {
                    "type": "GET",
                    "async": false,
                    "url": "/answer/getsimpleexerciseanswers",
                    "data": {category: 'Listening'},     
                    "dataSrc": "data",
                    "dataType": "json",
                    "cache":    false,
                },
                
                columns:[
                    //{title: "ID", data:"id", "visible": false}, 
                    {title: "Title", data:"title"},
                    {title: "Limit Time", data:"limit_time", "class": "right", width:105, "visible": true},
                    //{title: "Points", data:"points"},
                ], 

                scrollY: false,
                scrollX: false,
                scrollCollapse: false,
                jQueryUI: true,  
                dom: "tB",
                //firstAjax: false,            
            });

            var readinghistorygrid = $("#readinghistorytable").DataTable({
                serverSide: true,
                stateSave: false,

                "ordering": false,
                "info": true,
                "searching": true,  

                "ajax": {
                    "type": "GET",
                    "async": false,
                    "url": "/answer/getsimpleexerciseanswers",
                    "data": {category: 'Reading'},     
                    "dataSrc": "data",
                    "dataType": "json",
                    "cache":    false,
                },
                
                columns:[
                    //{title: "ID", data:"id", "visible": false}, 
                    {title: "Title", data:"title"},
                    {title: "Limit Time", data:"limit_time", "class": "right", width:105, "visible": true},
                    //{title: "Points", data:"points"},
                ], 

                scrollY: false,
                scrollX: false,
                scrollCollapse: false,
                jQueryUI: true,  
                dom: "tB",
                //firstAjax: false,            
            });

            var speakinghistorygrid = $("#speakinghistorytable").DataTable({
                serverSide: true,
                stateSave: false,

                "ordering": false,
                "info": true,
                "searching": true,  

                "ajax": {
                    "type": "GET",
                    "async": false,
                    "url": "/answer/getsimpleexerciseanswers",
                    "data": {category: 'Speaking'},     
                    "dataSrc": "data",
                    "dataType": "json",
                    "cache":    false,
                },
                
                columns:[
                    //{title: "ID", data:"id", "visible": false}, 
                    {title: "Title", data:"title"},
                    {title: "Limit Time", data:"limit_time", "class": "right", width:105, "visible": true},
                    //{title: "Points", data:"points"},
                ], 

                scrollY: false,
                scrollX: false,
                scrollCollapse: false,
                jQueryUI: true,  
                dom: "tB",
                //firstAjax: false,            
            });
	}
}

@Component({
    selector: 'app-manage-component',
    template: require('./dashboard.component_manage.html'),
    styles: [`${require('./dashboard.component.css')}`],
    animations: [routerTransition()],
    providers: [GlobalService]
})
export class DashManageComponent extends DashboardComponent implements OnInit { 
	constructor(private http1: Http, private router1: Router, private globalService1: GlobalService, private translate1: TranslateService) {	
		super(http1, router1, globalService1, translate1); 
	}

    ngOnInit() {
        
        this.http1.get("/welcome/getstatisticsdata").
        map(
            (response) => response.json()
        ).
        subscribe(
            (data) => {
                this.totalstudentcount = !isNaN(Number(data["totalstudentcount"]).valueOf())?Number(data["totalstudentcount"]).valueOf():0;
                this.totalteachercount = !isNaN(Number(data["totalteachercount"]).valueOf())?Number(data["totalteachercount"]).valueOf():0;
                this.uploadedproblemcount = !isNaN(Number(data["uploadedproblemcount"]).valueOf())?Number(data["uploadedproblemcount"]).valueOf():0;
                this.answercount = !isNaN(Number(data["answercount"]).valueOf())?Number(data["answercount"]).valueOf():0;
            }
        );

        var topstudentsgrid = $("#topstudentstable").DataTable({
            serverSide: true,
            stateSave: false,

            "ordering": false,
            "info": true,
            "searching": true,  

            "ajax": {
                "type": "GET",
                "async": false,
                "url": "/user/getusersimplelist",
                "data": {permission: 'D'},     
                "dataSrc": "data",
                "dataType": "json",
                "cache":    false,
            },
            columns:[
                {title: "Name", data:"first_name", render: function(data: any, type: any, row: any) {
                        return data+' '+row["last_name"];
                    } 
                },
                {title: "Login Times", data:"visited_count", class: "right"},
                {title: "Join Times", data:"anscount", class: "right"},
                {title: "Avg Mark", data:"avgmark", class: "right"},
            ], 

            scrollY: false,
            scrollX: false,
            scrollCollapse: false,
            jQueryUI: true,  
            dom: "tB",
            //firstAjax: false,            
        });       
        
        var topteachergrid = $("#topteachertable").DataTable({
            serverSide: true,
            stateSave: false,

            "ordering": false,
            "info": true,
            "searching": true,  

            "ajax": {
                "type": "GET",
                "async": false,
                "url": "/user/getusersimplelist",
                "data": {permission: 'B'},     
                "dataSrc": "data",
                "dataType": "json",
                "cache":    false,
            },
            
            columns:[
                {title: "Name", data:"first_name", render: function(data: any, type: any, row: any) {
                        return data+' '+row["last_name"];
                    } 
                },
                {title: "Login Times", data:"visited_count", class: "right"},
                {title: "Problem Count", data:"problemcount", class: "right"},
                {title: "Pass Problems", data:"passcount", class: "right"},
            ], 

            scrollY: false,
            scrollX: false,
            scrollCollapse: false,
            jQueryUI: true,  
            dom: "tsB",
            //firstAjax: false,            
        });

        var writingquizgrid = $("#writingquiztable").DataTable({
            serverSide: true,
            stateSave: false,

            "ordering": false,
            "info": true,
            "searching": true,  

            "ajax": {
                "type": "GET",
                "async": false,
                "url": "/problem/getsimpleproblems",
                "data": {category: 'Writing'},     
                "dataSrc": "data",
                "dataType": "json",
                "cache":    false,
            },
            
            columns:[
                {title: "Title", data:"title"},
                {title: "Limit Time", data:"limit_time", "class": "right", width:105, "visible": true},
                //{title: "Points", data:"points"},
                {title: "Date", data:"created_at"},
            ], 

            scrollY: false,
            scrollX: false,
            scrollCollapse: false,
            jQueryUI: true,  
            dom: "tsB",
            //firstAjax: false,            
        });

        var listeningquizgrid = $("#listeningquiztable").DataTable({
            serverSide: true,
            stateSave: false,

            "ordering": false,
            "info": true,
            "searching": true,  

            "ajax": {
                "type": "GET",
                "async": false,
                "url": "/problem/getsimpleproblems",
                "data": {category: 'Listening'},     
                "dataSrc": "data",
                "dataType": "json",
                "cache":    false,
            },
            
            columns:[
                {title: "Title", data:"title"},
                {title: "Limit Time", data:"limit_time", "class": "right", width:105, "visible": true},
                //{title: "Points", data:"points"},
                {title: "Date", data:"created_at"},
            ], 

            scrollY: false,
            scrollX: false,
            scrollCollapse: false,
            jQueryUI: true,  
            dom: "tsB",
            //firstAjax: false,            
        });

        var readingquizgrid = $("#readingquiztable").DataTable({
            serverSide: true,
            stateSave: false,

            "ordering": false,
            "info": true,
            "searching": true,  

            "ajax": {
                "type": "GET",
                "async": false,
                "url": "/problem/getsimpleproblems",
                "data": {category: 'Reading'},     
                "dataSrc": "data",
                "dataType": "json",
                "cache":    false,
            },
            
            columns:[
                {title: "Title", data:"title"},
                {title: "Limit Time", data:"limit_time", "class": "right", width:105, "visible": true},
                //{title: "Points", data:"points"},
                {title: "Date", data:"created_at"},
            ], 

            scrollY: false,
            scrollX: false,
            scrollCollapse: false,
            jQueryUI: true,  
            dom: "tsB",
            //firstAjax: false,            
        });

        var speakingquizgrid = $("#speakingquiztable").DataTable({
            serverSide: true,
            stateSave: false,

            "ordering": false,
            "info": true,
            "searching": true,  

            "ajax": {
                "type": "GET",
                "async": false,
                "url": "/problem/getsimpleproblems",
                "data": {category: 'Speaking'},     
                "dataSrc": "data",
                "dataType": "json",
                "cache":    false,
            },
            
            columns:[
                {title: "Title", data:"title"},
                {title: "Limit Time", data:"limit_time", "class": "right", width:105, "visible": true},
                //{title: "Points", data:"points"},
                {title: "Date", data:"created_at"},
            ], 

            scrollY: false,
            scrollX: false,
            scrollCollapse: false,
            jQueryUI: true,  
            dom: "tsB",
            //firstAjax: false,            
        });
    }
}