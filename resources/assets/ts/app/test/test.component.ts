import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { routerTransition } from '../router.animations';
import { GlobalService } from '../shared/services/global.service';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { Test } from '../model/test';
import { Testevent } from '../model/testevent';
import { StatusRenderComponent } from './status-render.component';
import { TypeRenderComponent } from './type-render.component';

@Component({
	selector: 'app-test',
	template: require('./test.component.html'),
	styles: [`${require('./test.component.css')}`],
	animations: [routerTransition()],
	providers: [GlobalService]
})
export class TestComponent implements OnInit {
    classes = ['Basic', 'Bronze', 'Silver', 'Gold'];
    pclasses = [
        { value:"", title:"* Class" },
        { value:"Basic", title:"Basic" },
        { value:"Bronze", title:"Bronze" },
        { value:"Silver", title:"Silver" },
        { value:"Gold", title:"Gold" }
        ];

	degrees = ['Easy', 'Medium', 'Hard'];
    pdegrees = [
        { value:"", title:"* Degree" },
        { value:"Easy", title:"Easy" },
        { value:"Medium", title:"Medium" },
        { value:"Hard", title:"Hard" }
        ];

    actionflag : boolean = window.sessionStorage.getItem('permission')=='A';
    savefalg: boolean = true;
	
	gridsettings: any;
    testdatasource: ServerDataSource;

    quizsettings: any;
    localdata: any[];
    quizdatasource: LocalDataSource = new LocalDataSource();
    
    categoryNames: any[];
    typeNames: any[];
    
    newtestconfigflag: boolean;
    listtestflag: boolean;

    curselectedrowid: number;
    curselectedTest: Test;
    
    curevent_id: number;
    curtestevent_info: Testevent;

	constructor(private http: Http, private router: Router, private globalService: GlobalService) { 

    }

	ngOnInit() {
        this.newtestconfigflag = false;
        this.listtestflag = true;

        this.curselectedrowid = 0;
        this.curselectedTest = new Test;

        this.categoryNames = this.globalService.quizCategoryNames;
        this.typeNames = this.globalService.quizTypeNames;

		this.gridsettings = {
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
                display: true,
                perPage: 15,
            },
            columns: {
                testname: {
                    title: 'Name'
                },
                testclass: {
                    title: 'Class',
                    filter: {
                      type: 'list',
                      config: {
                        selectText: 'Select...',
                        list: [
                          { value: 'Basic', title: 'Basic' },
                          { value: 'Bronze', title: 'Bronze' },
                          { value: 'Silver', title: 'Silver' },
                          { value: 'Gold', title: 'Gold' },
                        ],
                      },
                    },
                },
                testdegree: {
                    title: 'Degree',
                    filter: {
                      type: 'list',
                      config: {
                        selectText: 'Select...',
                        list: [
                          { value: 'Easy', title: 'Easy' },
                          { value: 'Medium', title: 'Medium' },
                          { value: 'Hard', title: 'Hard' },
                        ],
                      },
                    },
                },
                totalmarks: {
                    title: 'Marks'
                },
                limit_time: {
                    title: 'limit_time(min)'
                },
                count: {
                    title: 'count'
                },
                status: {
                    title: 'Status',
                    type: 'custom',
                    renderComponent: StatusRenderComponent,
                }
            }
        };

        this.testdatasource = new ServerDataSource(this.http, { totalKey: "total", dataKey: "data", endPoint: '/test/getlist' });

        this.localdata = [];

        this.quizdatasource.load(this.localdata);

        this.quizsettings = {
            mode: 'inline',
            selectMode: 'single',
            hideHeader: false,
            hideSubHeader: false,
            actions: {
                columnTitle: '',
                add: true,
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
            add: {
                inputClass: '',
                addButtonContent: 'Add New',
                createButtonContent: 'Create',
                cancelButtonContent: 'Cancel',
                confirmCreate: true,
            },
            delete: {
                deleteButtonContent: 'Delete',
                confirmDelete: true,
            },
            attr: {
                id: 'quizgrid',
                class: 'table table-bordered table-hover table-striped',
            },
            noDataMessage: 'No data found',            
            pager: {
                display: false,
                perPage: 5,
            },
            columns: {
                /*category: {
                    title: 'Category',
                    filter: {
                        type: 'completer',
                        config: {
                            completer: {
                                data: this.categoryNames,
                                searchFields: 'value',
                                titleField: 'title',
                            },
                        },
                    },
                    editor: {
                        type: 'completer',
                        config: {
                            completer: {
                                data: this.categoryNames,
                                searchFields: 'value',
                                titleField: 'title',
                            },
                        },
                    }
                },*/ 
                type: {
                    title: 'Type',
                    type: 'custom',
                    renderComponent: TypeRenderComponent,
                    filter: {
                      type: 'list',
                      config: {
                        selectText: 'Select...',
                        list: this.typeNames,
                      },
                    },
                    editor: {
                      type: 'list',
                      config: {
                        list: this.typeNames,
                      },
                    }
                },                               
                degree: {
                    title: 'Degree',
                    filter: {
                      type: 'list',
                      config: {
                        selectText: 'Select...',
                        list: [
                          { value: 'Easy', title: 'Easy' },
                          { value: 'Medium', title: 'Medium' },
                          { value: 'Hard', title: 'Hard' },
                        ],
                      },
                    },
                    editor: {
                      type: 'list',
                      config: {
                        list: [
                          { value: 'Easy', title: 'Easy' },
                          { value: 'Medium', title: 'Medium' },
                          { value: 'Hard', title: 'Hard' },
                        ],
                      },
                    }
                },
                count: {
                    title: 'Count'
                }
            }
        };
	}

    goTestingRoom() {
        if( this.curselectedrowid == 0 ) {
            window.alert("Select test row.");
        } else {
            /* continue/new confirm */
            
            /* get testevent_info with uid */
            this.http.get("/test/gettestevent/"+this.curselectedrowid).
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
                            this.router.navigate(['/examinee', this.curtestevent_info.id]);
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
                                        this.http.get("/test/generatetestevent/"+this.curselectedrowid).
                                        map(
                                            (response) => response.json()
                                        ).
                                        subscribe(
                                            (data) => {
                                                this.curevent_id = data;
                                                this.router.navigate(['/examinee', this.curevent_id]);                                                
                                            }
                                        );
                                    } else {
                                        alert("old testevent update error. Retry!")
                                    }                                    
                                }
                            );
                        }
                    } else {                    
                        this.http.get("/test/generatetestevent/"+this.curselectedrowid).
                        map(
                            (response) => response.json()
                        ).
                        subscribe(
                            (data) => {
                                this.curevent_id = data;
                                this.router.navigate(['/examinee', this.curevent_id]);    
                            }
                        );
                    }     
                }
            );
        }        
    }
	
    newConfigTestForm() {
        this.newtestconfigflag = true;        
        this.listtestflag = false;

        this.curselectedrowid = 0;
        this.curselectedTest = new Test;
        this.curselectedTest.testclass = "";
        this.curselectedTest.testdegree = "";
        this.quizdatasource.load(this.localdata);
    }

    chgConfigTestForm() {
        if( this.curselectedrowid == 0 ) {
            window.alert("Select test row.");
        } else {
            this.newtestconfigflag = true;            
            this.listtestflag = false;
        }        
    }

    deleteTest() {
        if( this.curselectedrowid == 0 ) {
            window.alert("Select test row.");
        } else {
            if (window.confirm('Are you sure you want to delete?')) {
                this.http.get("/test/delete/"+this.curselectedrowid).
                map(
                    (response) => response.json()
                ).
                subscribe(
                    (data) => {
                        if(data.state == "error"){
                            alert(data.message); 
                        } else {
                            this.testdatasource.refresh();
                            this.curselectedrowid = 0;
                            this.curselectedTest = new Test;   
                            this.curselectedTest.testclass = "";
                            this.curselectedTest.testdegree = "";
                        }
                    }
                );
            }
        }        
    }

    onClickList() {
        this.newtestconfigflag = false;        
        this.listtestflag = true;   

        this.curselectedrowid = 0;
        this.curselectedTest = new Test;
        this.curselectedTest.testclass = "";
        this.curselectedTest.testdegree = "";
    }

    onTestRowSelect(event: any) {
        if(this.curselectedrowid == event.data.id) {
            this.curselectedrowid = 0;
            this.curselectedTest = new Test;
            this.curselectedTest.testclass = "";
            this.curselectedTest.testdegree = "";
        } else {
            this.curselectedrowid = event.data.id;
            this.curselectedTest = event.data;  
            this.quizdatasource.load(event.data.preset.__zone_symbol__value);            
        }
    }

    onClickSave() {

        if(this.curselectedTest.testname == null || this.curselectedTest.testname.length == 0 || this.curselectedTest.testname.length > 100 ) {
            this.savefalg = false;
            return;
        }

        if(this.curselectedTest.testclass == "") {
            this.savefalg = false;
            return;
        }

        if(this.curselectedTest.testdegree == "") {
            this.savefalg = false;
            return;
        }

        if(Number(this.curselectedTest.totalmarks).valueOf() < 0 ) {
            this.savefalg = false;
            return;
        }

        if(Number(this.curselectedTest.limit_time).valueOf() < 0) {
            this.savefalg = false;
            return;
        }

        if(this.quizdatasource.count() <= 0 ) {
            window.alert("Add QuizConfig info.")
            return;
        }

        if(!this.curselectedTest.status) {
            this.curselectedTest.status = 0;
        } else {
            this.curselectedTest.status = 1;
        }

        this.curselectedTest.preset = this.quizdatasource.getAll();
        this.http.post("/test/save", this.curselectedTest).
        map(
            (response) => response.json()
        ).
        subscribe(
            (data) => {
                if(data.state == "error"){
                    alert(data.message);                
                } else {
                    this.onClickList();
                }
            }
        );
    }

    onCreateConfirm(event: any) {
        if(event.newData.type == "") {
            window.alert("Select QuizType field.");
        } else if(event.newData.degree == "") {
            window.alert("Select QuizDegree field.");
        } else if( isNaN(event.newData.count) || event.newData.count <= 0) {
            window.alert("Select QuizCount field with Integer.");
        } else { //if (window.confirm('Are you sure you want to create?'))
            event.confirm.resolve(event.newData); 
            if(isNaN(this.curselectedTest.count)) {
                this.curselectedTest.count = 0;
            }
            this.curselectedTest.count += Number(event.newData.count).valueOf();            
        } 
    }

    onSaveConfirm(event: any) {
        if( isNaN(event.newData.count) || event.newData.count <= 0) {
            window.alert("Select QuizCount field with Integer.");
        } else { //if (window.confirm('Are you sure you want to save?'))            
            event.confirm.resolve(event.newData); 
            this.curselectedTest.count += Number(event.newData.count).valueOf() - Number(event.data.count).valueOf();                                          
        } 
        /*else {
            event.confirm.reject();
        }*/
    }

    onDeleteConfirm(event: any) {
        if (window.confirm('Are you sure you want to delete?')) {
            event.confirm.resolve();            
            this.curselectedTest.count -= Number(event.data.count).valueOf();                                          
        } else {
            event.confirm.reject();
        }
    }    
}
