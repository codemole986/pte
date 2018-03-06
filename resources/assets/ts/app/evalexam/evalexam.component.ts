import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { routerTransition } from '../router.animations';
import { GlobalService } from '../shared/services/global.service';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { Problem } from '../model/problem';
import { Answer } from '../model/answer';
import { Testevent } from '../model/testevent';
import { EvalstatusRenderComponent } from './evalstatus-render.component';
import { TranslateService } from '@ngx-translate/core';

declare var $:any;
declare var bootbox: any;
declare var Metronic: any;

@Component({
  	selector: 'app-evalexam',
  	template: require('./evalexam.component.html'),
	styles: [`${require('./evalexam.component.css')}`],	
    animations: [routerTransition()],
	providers: [GlobalService]  
})
export class EvalexamComponent implements OnInit {
	
	listvisible: boolean = false;		
	evalvisible: boolean = false;
	i: number;
	arr_types: any[];

	quiz_id: number;	
	testevent_id: number;
	curtestevent_info: Testevent;	
	quiz_list: any;
	quiz_number: number;
	
	arrchecknumber: any[];
	curtotalpoint: number;
	stdtotalpoint: number;
	currentProblem: Problem;
	currentAnswer: Answer;

	old_eval_marks: number = 0;
	testmarks: number = 0;
	
	endbutton: boolean;
	nextbutton: boolean;
	previousbutton: boolean;
	
	actionflag : boolean = window.sessionStorage.getItem('permission')=='C' || localStorage.getItem('permission')=='A';
	evalgridsettings: any;
    evaldatasource: ServerDataSource;
    curselectedrowid: number; //examineeid/testeventid
    curevalstatus: number; //evaluate_status

    evaluate_flag : boolean = false;
    active_menu: string = "overview";
	
	constructor(private http: Http, private route: ActivatedRoute,
  private router: Router, private globalService: GlobalService, private translate: TranslateService) { 
		this.quiz_id = 0;		
		this.curtestevent_info = new Testevent;
		this.previousbutton = false;
		this.endbutton = false;
		this.nextbutton = false;

		this.currentProblem = new Problem;
		this.currentProblem.type = "WSM";	
		this.currentProblem.content = this.globalService.getContentObject(this.currentProblem.type);
		this.currentProblem.solution = this.globalService.getSolutionObject(this.currentProblem.type);
		this.currentAnswer = new Answer;	
		this.currentAnswer.answer = this.globalService.getSolutionObject(this.currentProblem.type);	

		this.arrchecknumber = [];
		this.curtotalpoint = 0;
		this.stdtotalpoint = 0;

		
	}

	ngOnInit() {		
		switch(window.sessionStorage.getItem('permission')) {
    		case 'A' : this.active_menu = "manage"; break;
			case 'B' : this.active_menu = "teacher"; break;
			case 'D' : this.active_menu = "student"; break;
			default : this.active_menu = "overview";
    	}
    	
		//this.testevent_id = this.route.snapshot.params['testid'];
		if(this.testevent_id!=null) {
			this.listvisible = false;
			this.evalvisible = true;
			this.getTestevent(this.testevent_id);									
		} else {
			this.listvisible = true;
        }

        this.evalgridsettings = {
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
                id: 'examineegrid',
                class: 'table table-bordered table-hover',
            },
            noDataMessage: 'No data found',            
            pager: {
                display: true,
                perPage: 15,
            },
            columns: {
            	evalallow_at: {
                	title: "Allow Date",	
                },
                email: {
                	title: 'User',
                },
                testname: {
                	title: "TestName",
                },
                testclass: {
                	title: "Class",
                },
                testdegree: {
                	title: "Degree",
                }, 
                count: {
                	title: "QuizCount",
                },
                limit_time: {
                	title: "LimitTime(min)",
                },
                start_at: {
                	title: 'Test StartTime',
                },                
                totalmarks: {
                	title: "StdMarks",
                },
                evaluate_status: {
                	title: "Status",
                    type: 'custom',
                    renderComponent: EvalstatusRenderComponent,	
                },                
                marks: {
                	title: "Marks",	
                }
            }
        };

        this.evaldatasource = new ServerDataSource(this.http, { totalKey: "total", dataKey: "data", endPoint: '/test/gettesteventlist' });

        this.curselectedrowid = 0;  
        Metronic.init();
	}

	getTypes(category: string) {
    	return this.globalService.problemTypes[category];
    }

	getTypeName(category: string, value: string) {
    	this.arr_types = this.getTypes(category);
    	if(this.arr_types != null) {
    		for (this.i = 0;  this.i < this.arr_types.length; this.i++) {
		    	if (this.arr_types[this.i].value == value)
	    			return this.arr_types[this.i].title;
	    	}
    	}
    	
    	return '';
    }

	onEvalRowSelect(event: any) {
        if(!event.isSelected){      
            this.curselectedrowid = 0;  
            this.testevent_id = null;          
        } else {
            this.curselectedrowid = event.data.id;
            this.testevent_id = event.data.id;
            this.curevalstatus = event.data.evaluate_status;
        }
    }

    evaluateExam() {
    	if(this.curselectedrowid == 0) {
    		this.translate.stream("Select row.").subscribe((res: any) => {
                Metronic.showWarnMsg(res);
            });
    		return false;
    	} else if(this.curevalstatus == 3) {
    		var that = this;
    		this.translate.stream("Are you sure you want to re-evaluate this examinee?").subscribe((res: any) => {
                bootbox.confirm(res, function(result: any) {
	    			if (result) {
		    			// modify status with 2
		    			that.http.get("/test/update2evalstatus/"+that.curselectedrowid).
				        map(
				            (response) => response.json()
				        ).
				        subscribe(
				            (data) => {
				            	if(data.state == "success") {
				            		that.listvisible = false;
									that.evalvisible = true;
									that.getTestevent(that.curselectedrowid);			
		    					} else {
		    						this.translate.stream("status update error. Retry!").subscribe((res: any) => {
						                Metronic.showErrMsg(res);
						            });
		    					}
		    				}
		    			);
		    		} else {
		    			return false;
		    		}
	    		});
            });
    	} else if(this.curevalstatus == 1) {
    		// modify status with 2
    		this.http.get("/test/update2evalstatus/"+this.curselectedrowid).
	        map(
	            (response) => response.json()
	        ).
	        subscribe(
	            (data) => {
	            	if(data.state == "success") {
	            		this.listvisible = false;
						this.evalvisible = true;
						this.getTestevent(this.curselectedrowid);		
					} else {
						this.translate.stream("status update error. Retry!").subscribe((res: any) => {
			                Metronic.showErrMsg(res);
			            });
					}
				}
			);
    	} else {
    		this.listvisible = false;
			this.evalvisible = true;
			this.getTestevent(this.curselectedrowid);		
    	}
    }

    getTestevent(eid: number) {
		this.http.get("/test/gettesteventrow/"+eid).
        map(
            (response) => response.json()
        ).
        subscribe(
            (data) => {
            	this.curtestevent_info = data[0];
            	this.quiz_list = this.curtestevent_info.problem_list;

            	for( var pn=0; pn<this.curtestevent_info.count; pn++) {
            		if(this.quiz_list[pn+1] == null) {
	            		continue;
	            	} else {
	            		this.quiz_number = pn+1;
	            		this.quiz_id = this.quiz_list[this.quiz_number];
	            		break;
	            	}
            	}

            	
            	if(this.quiz_number == 1) {
            		this.previousbutton = false;            		
            	} else {
					this.previousbutton = true;
				}

				if(this.quiz_number < this.curtestevent_info.count) {
            		this.nextbutton = true;            		
            	} else {
					this.nextbutton = false;
				}				

            	if(this.quiz_id != 0) {
            		this.getProblem(this.quiz_id);
            	}
            	
            }
        );
	}

	getProblem(qid: number) {
		this.http.get("/problem/getproblem/"+qid).
		map(
			(response) => response.json()
		).
		subscribe(
			(data) => {
				if(typeof data.id == "number") {
					this.currentProblem = data;
					this.http.get("/answer/getanswer/"+this.testevent_id+"/"+data.id).
					map(
						(response) => response.json()
					).
					subscribe(
						(ansdata) => {
							if(typeof ansdata.id == "number") {
								this.currentAnswer = ansdata;	
								this.old_eval_marks = this.currentAnswer.evaluate_mark;								
							} else {
								this.currentAnswer.answer = this.globalService.getSolutionObject(this.currentProblem.type);
								if(this.evalvisible) {
									this.currentAnswer.testevent_id = this.testevent_id;					
								} else {
									this.currentAnswer.testevent_id = 0;					
								}
								this.currentAnswer.quiz_id = data.id;	
								this.currentAnswer.evaluate_mark = 0;
								this.old_eval_marks = 0;
							}
						}
					);

					this.currentAnswer.type = data.type;									
					
				} else {
					this.currentAnswer.answer = this.globalService.getSolutionObject(this.currentProblem.type);
					this.old_eval_marks = 0;
					this.translate.stream("No Problem!!!").subscribe((res: any) => {
		                Metronic.showWarnMsg(res);
		            });
				}
			}
		)
	}

	onClickList(){
		this.listvisible = true;
		this.evalvisible = false;
		this.curselectedrowid = 0;
	}

	prevExamine() {
		if(!this.endbutton)
			this.onSaveQuizMarks();	

		if(this.quiz_number>1)
			this.quiz_number--;
		else
			this.quiz_number = 1;

		if(this.quiz_number == 1)
			this.previousbutton = false;
		else
			this.previousbutton = true;

		if(this.quiz_number < this.curtestevent_info.count) {
    		this.nextbutton = true;            		
    	} else {
			this.nextbutton = false;
		}

		this.quiz_id = this.quiz_list[this.quiz_number];
		this.getProblem(this.quiz_id);			
	}

	nextExamine() {
		if(!this.endbutton)
			this.onSaveQuizMarks();	

		this.quiz_number++;
		if(this.quiz_number > this.curtestevent_info.count) {
			this.quiz_number = this.curtestevent_info.count;
		}

		if(this.quiz_number < this.curtestevent_info.count) {
			this.nextbutton = true;	
		} else {
			this.nextbutton = false;	
		}

		if(this.quiz_number > 1) {
			this.previousbutton = true;
		} else {
			this.previousbutton = false;
		}
		
		this.quiz_id = this.quiz_list[this.quiz_number];
		this.getProblem(this.quiz_id);			
	}

	evaluateExamine() {
		// evaluation examinee
		var eval_point = Math.round(this.currentAnswer.evaluate_mark);
		
		if(this.arrchecknumber.indexOf(this.quiz_number) > -1) {
			this.curtotalpoint += Number(eval_point).valueOf() - this.old_eval_marks;	
		} else {
			this.arrchecknumber.push(this.quiz_number);
			this.curtotalpoint += Number(eval_point).valueOf();
			this.stdtotalpoint += Number(this.currentProblem.points).valueOf();
		}
	}	

	onSaveQuizMarks(endFlag: boolean = false) {
		if(typeof this.currentAnswer.quiz_id == "number") {
			this.evaluateExamine();		
			if(endFlag){
				this.evaluateTest();
			}

			this.http.post("/answer/updatemarks", this.currentAnswer).
	    	map(
	            (response) => response.json()
	        ).
	        subscribe(
	    		(data) => {
	    			if(data.state == "error") {
	    				Metronic.showErrMsg(data.message);	
	    			}    			
	    		}
	    	);
		}		
    }

    evaluateTest() {		
		this.testmarks = Math.round( this.curtestevent_info.totalmarks / this.stdtotalpoint * this.curtotalpoint );
		if(isNaN(this.testmarks)) {
			this.testmarks = 0;
		}
		this.curtestevent_info.marks = this.testmarks;
		this.curtestevent_info.evaluate_status = 3;
	}

	endEvalExamine() {
		this.endbutton = true;		
		this.onSaveQuizMarks(true);	

		//
		this.http.post("/test/updatetesteventevalmarks/"+this.testevent_id, this.curtestevent_info).
        map(
            (response) => response.json()
        ).
        subscribe(
            (data) => {
            	if(data.state == "error") {
            		Metronic.showErrMsg(data.message);
            	}		            	
            }
        );
	}

	onChangeQuizMarks() {
		if(this.currentAnswer.evaluate_mark < 0) {
			this.currentAnswer.evaluate_mark = 0;
		} else if(this.currentAnswer.evaluate_mark > this.currentProblem.points) {
			this.currentAnswer.evaluate_mark = this.currentProblem.points;
		} 
	}

}
