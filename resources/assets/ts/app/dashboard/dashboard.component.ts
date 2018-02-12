import { Component, OnInit, AfterViewInit, Directive, OnDestroy, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { routerTransition } from '../router.animations';
import { GlobalService } from '../shared/services/global.service';
import { Problem } from '../model/problem';
import { Testevent } from '../model/testevent';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
declare var $:any;
declare var angular:any;
declare var Dropzone: any;


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

    
    testgridsettings: any;
    testdatasource: ServerDataSource;
    curselectedtestid: number;
    curevent_id: number;
    curtestevent_info: Testevent;
    
    examgridsettings: any;
    examdatasource: ServerDataSource;
    
    arr_types: any[];
    i: number;
    charttype: String;
    chartdata: any;
    chartdata2: any;
    chartoptions: any;

    constructor(private http: Http, private router: Router, private globalService: GlobalService) {
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
        //Dropzone.autoDiscover = false;
        //this.create_dropzone();

        this.curselectedtestid = 0;
        this.testgridsettings = {
            mode: 'inline',
            selectMode: 'single',
            hideHeader: false,
            hideSubHeader: true,
            actions: {
                columnTitle: 'Actions',
                add: false,
                edit: false,
                'delete': false,                
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
                confirmSave: false,
            },
            add: {
                inputClass: '',
                addButtonContent: 'Add New',
                createButtonContent: 'Create',
                cancelButtonContent: 'Cancel',
                confirmCreate: false,
            },
            delete: {
                deleteButtonContent: 'Delete',
                confirmDelete: false,
            },
            attr: {
                id: 'testgrid',
                class: 'table table-bordered table-hover table-striped',
            },
            noDataMessage: 'No data found',            
            pager: {
                display: false,
                perPage: 5,
            },
            columns: {
                testname: {
                    title: 'Test Name'
                },
                testclass: {
                    title: 'Test Class'
                },
                testdegree: {
                    title: 'Test Degree'
                },
                totalmarks: {
                    title: 'FullMarks'
                },
                limit_time: {
                    title: 'limit_time'
                },
                count: {
                    title: 'Quiz Count'
                }
            }
        };

        this.testdatasource = new ServerDataSource(this.http, { endPoint: '/test/getcustomlist' });

        this.examgridsettings = {
            mode: 'inline',
            selectMode: 'single',
            hideHeader: false,
            hideSubHeader: true,
            actions: {
                columnTitle: 'Actions',
                add: false,
                edit: false,
                'delete': false,                
                position: 'left'
            },
            attr: {
                id: 'examgrid',
                class: 'table table-bordered table-hover table-striped',
            },
            noDataMessage: 'No data found',            
            pager: {
                display: false,
                perPage: 5,
            },
            columns: {
                start_at: {
                    title: 'Start Time'
                },
                testclass: {
                    title: 'Test Class'
                },
                testdegree: {
                    title: 'Test Degree'
                },
                end_at: {
                    title: 'End Time'
                },
                marks: {
                    title: 'Marks'
                }
            }
        };

        this.examdatasource = new ServerDataSource(this.http, { endPoint: '/test/getsimpletesteventlist' });
              
        this.charttype = 'bar';
        this.chartdata = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            
            datasets: [
                {
                    label: "Writing",              
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: 'rgba(75, 192, 132, 0.2)',
                    borderColor:'rgba(75, 192, 132, 1)',
                    borderWidth: 1            
                },
                {
                    label: "Listening",
                    data: [35, 29, 70, 81, 76, 95, 14],
                    backgroundColor: 'rgba(132, 75, 192, 0.2)',
                    borderColor: 'rgba(132,75,192, 1)',
                    borderWidth: 1
                },
                {
                    label: "Speaking",
                    data: [15, 79, 60, 91, 65, 75, 30],
                    backgroundColor: 'rgba(0, 75, 255, 0.2)',
                    borderColor: 'rgba(0, 132, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: "Reading",
                    data: [15, 79, 60, 91, 65, 75, 30],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255,99,132, 1)',
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

        this.chartdata2 = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            
            datasets: [
                {
                    label: "Max",              
                    data: [65, 59, 80, 81, 86, 75, 90],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor:'rgba(75, 192, 192, 1)',
                    borderWidth: 1            
                },
                {
                    label: "Min",
                    data: [35, 29, 17, 41, 56, 35, 14],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        };

    }

    create_dropzone() {
    
        var audioNgApp = angular.module('uploadaudio',[
            'thatisuday.dropzone'
        ])

        //console.log("aaaaaaaaaaaaaa");
        //console.log(audioNgApp);

        audioNgApp.config(function(dropzoneOpsProvider: any){

            dropzoneOpsProvider.setOptions({
                url : '/uploadfile.php',
                maxFilesize : '10',   
                //acceptedFiles : 'audio/mp3',
                addRemoveLinks : true, 
                //params: {"type": "LWS", "kind":"problem"},                 
            });
        });
        
    }


    onTestRowSelect(event: any) {
        if(this.curselectedtestid == event.data.id) {
            this.curselectedtestid = 0;
        } else {
            this.curselectedtestid = event.data.id;          
        }
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

    goExamineeForm(event_id: number) {
        this.router.navigate(['/examinee', event_id]);
    }

    showTestForm() {
        if( this.curselectedtestid == 0 ) {
            window.alert("Select test row.");
        } else {
            /* continue/new confirm */
            
            /* get testevent_info with uid */
            this.http.get("/test/gettestevent/"+this.curselectedtestid).
            map(
                (response) => response.json()
            ).
            subscribe(
                (data) => {
                    if(data.length > 0 ) {
                        // if exist testevent_info
                        //      confirm(continue/new)
                        this.curtestevent_info = data[0]; 
                        if(window.confirm("Continue Test?")) {
                            // if yes(continue)
                            //      go old_testevent
                            this.goExamineeForm(this.curtestevent_info.id);
                        } else {
                            // if no(new)
                            //      update status in old_testevent
                            this.http.get("/test/updateteststatus/"+this.curtestevent_info.id).
                            map(
                                (response) => response.json()
                            ).
                            subscribe(
                                (data) => {
                                    if(data.state == "success") {
                                        //      new testevent generate
                                        this.http.get("/test/generatetestevent/"+this.curselectedtestid).
                                        map(
                                            (response) => response.json()
                                        ).
                                        subscribe(
                                            (data) => {
                                                this.curevent_id = data;
                                                this.goExamineeForm(this.curevent_id);
                                            }
                                        );
                                    } else {
                                        alert("old testevent update error. Retry!")
                                    }                                    
                                }
                            );
                        }
                    } else {                    
                        this.http.get("/test/generatetestevent/"+this.curselectedtestid).
                        map(
                            (response) => response.json()
                        ).
                        subscribe(
                            (data) => {
                                this.curevent_id = data;
                                this.goExamineeForm(this.curevent_id);
                            }
                        );
                    }     
                }
            );
        }
        
    }

}
