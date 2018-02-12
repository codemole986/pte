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
import {EditorComponent} from './editor/editor.component';
import {ProblemComponent} from './problem/problem.component';

@Component({
  	selector: 'app-examinee',
  	template: require('./examinee.component.html'),
	styles: [`${require('./examinee.component.css')}`],	
    animations: [routerTransition()],
	providers: [GlobalService]  
})
export class ExamineeComponent implements OnInit {
	httpdata: any[];

	quiz_id: number;	
	testevent_id: number;
	curtestevent_info: Testevent;
	quiz_list: any;
	quiz_number: number;
	mark: number;
	arrchecknumber: any[];
	curtotalpoint: number;
	stdtotalpoint: number;
	currentProblem: Problem;
	currentAnswer: Answer;
	currentlimittime: number;	
	endbutton: boolean;
	nextbutton: boolean;
	previousbutton: boolean;
	answertext: boolean;
	solutiontextvisible: boolean;
	markvisible: boolean;
	ctimer: any;
	i: number;
	arr_types: any[];
	editordata: Answer;
	problemdata: Problem;

	timerflag: boolean = false;
	listvisible: boolean = false;	
	selfexam: boolean = false;
	testvisible: boolean = false;

	radio_answer_val: string;
	check_answer_val: any[];
	check_solution_val: any[];

	select_left_values: any[];
	select_right_values: any[];
	order_left_options: any[];
	order_right_options: any[];

	audio_flag: boolean;
	audio_autoplay: boolean;

	recorder: any;
	mediastream: any;

	rfb_content: string;
	rfb_probhtml: string;
	rfb_answerhtml: string;
	rfb_solutionhtml: string;
	rfb_options: any[];
	rfb_selected_options: any[];

	ran_content: string;
	ran_selectlist: any[];

	progressvalue: number;

	@ViewChild('htmldata') htmldata: ElementRef;
	@ViewChild('choicepanel') choicepanel: ElementRef;
	@ViewChild('html_answerdata') html_answerdata: ElementRef;

	examineegridsettings: any;
    examineedatasource: ServerDataSource;
    curselectedrowid: number; //examineeid/testeventid
    curevaluatestatus: number; 

    viewexamflag: boolean = false;
    audiovisibleflag : boolean = false;
    _token : string = window.sessionStorage.getItem('_token');
	
	constructor(private http: Http, private route: ActivatedRoute,
  private router: Router, private globalService: GlobalService) { 
		this.quiz_id = 0;		
		this.curtestevent_info = new Testevent;
		this.previousbutton = false;
		this.endbutton = false;
		this.nextbutton = false;
		this.answertext = false;
		this.solutiontextvisible = false;
		this.markvisible = false;
		this.currentProblem = new Problem;
		this.currentProblem.type = "WSM";	
		this.currentProblem.content = this.globalService.getContentObject(this.currentProblem.type);
		this.currentAnswer = new Answer;	
		this.currentAnswer.answer = this.globalService.getSolutionObject(this.currentProblem.type);	

		this.audio_flag = false;
		this.audio_autoplay = false; 

		this.arrchecknumber = [];
		this.curtotalpoint = 0;
		this.stdtotalpoint = 0;
	}

	

	ngOnInit() {		
		this.testevent_id = this.route.snapshot.params['testid'];
		this.quiz_id = this.route.snapshot.params['id'];
		if(this.testevent_id!=null) {
			this.selfexam = false;
			this.listvisible = false;
			this.testvisible = true;
			this.timerflag = true;
			this.getTestevent(this.testevent_id);									
		} else if(this.quiz_id!=null) {
			this.selfexam = true;
			this.listvisible = false;
			this.testvisible = false;
			this.timerflag = true;
			this.getProblem(this.quiz_id);									
		} else {
			this.listvisible = true;
			this.testvisible = false;
			this.selfexam = false;

			this.examineegridsettings = {
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
	                class: 'table table-bordered table-hover table-striped',
	            },
	            noDataMessage: 'No data found',            
	            pager: {
	                display: true,
	                perPage: 15,
	            },
	            columns: {
	                start_at: {
	                	title: 'StartTime',
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
	                totalmarks: {
	                	title: "StdMarks",
	                },
	                test_status: {
	                	title: "Test Status",	
	                },
	                evaluate_status: {
	                	title: "Evaluate Status",	
	                },
	                checker_email: {
	                	title: "Evaluator",	
	                },
	                marks: {
	                	title: "Marks",	
	                }
	            }
	        };

	        this.examineedatasource = new ServerDataSource(this.http, { totalKey: "total", dataKey: "data", endPoint: '/test/gettesteventlist' });

		}		
	}


	onExamineeRowSelect(event: any) {
        if(this.curselectedrowid == event.data.id) {
            this.curselectedrowid = 0;            
        } else {
            this.curselectedrowid = event.data.id;
            this.curevaluatestatus = event.data.evaluate_status;
        }
    }

    deleteExam() {
    	if( this.curselectedrowid == 0 ) {
            window.alert("Select test row.");
        } else if(this.curevaluatestatus != 0) {
        	window.alert("Can't Delete the row.");
        } else {
            if (window.confirm('Are you sure you want to delete?')) {
            	this.http.get("/test/eventdelete/"+this.curselectedrowid).
                map(
                    (response) => response.json()
                ).
                subscribe(
                    (data) => {
                        if(data.state == "error"){
                            alert(data.message); 
                        } else {
                            this.examineedatasource.refresh();
                            this.curselectedrowid = 0;                            
                        }
                    }
                );
            }
        }
    }

    viewExam() {
    	if( this.curselectedrowid == 0 ) {
            window.alert("Select test row.");
        } else if(this.curevaluatestatus == 0) {
        	window.alert("Can't View the exam.");
        } else {
        	//this.visibility = true;
        	this.viewexamflag = true;
        	this.selfexam = false;
			this.listvisible = false;
			this.testvisible = true;
			this.timerflag = false;
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

            	if(this.testvisible && this.timerflag) {
					this.currentlimittime = Number(this.curtestevent_info.limit_time*60).valueOf();	
					this.ctimer = setInterval(()=> {
						this.currentlimittime--; 
						if(this.currentlimittime<=0) 
							this.endExamine(); 						
					}, 1000 );	
					this.markvisible = false;					
				}

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

	evaluateTest() {		
		this.mark = Math.round( this.curtestevent_info.totalmarks / this.stdtotalpoint * this.curtotalpoint );
		if(isNaN(this.mark)) {
			this.mark = 0;
		}
		this.curtestevent_info.marks = this.mark;
	}

	endExamine() {
		if(this.selfexam) {
 			clearInterval(this.ctimer);
			this.endbutton = true;		
			this.answertext = true;	
			this.solutiontextvisible = false;
			this.markvisible = true;
			this.audio_autoplay = false; 
			
			if(this.audio_flag) {				
				stopRecording();
				this.audiovisibleflag = true;	
			}
			//this.onSave();	
			this.evaluateExamine();		
		} else {
			if (window.confirm('Are you sure you want to terminate test?')) {
				clearInterval(this.ctimer);
				this.endbutton = true;		
				this.answertext = true;	
				this.solutiontextvisible = false;				
				this.markvisible = true;
				this.audio_autoplay = false; 
				
				if(this.audio_flag) {
					stopRecording();
				}
				this.onSave(true);	

				//
				this.http.post("/test/updatetesteventmarks/"+this.testevent_id, this.curtestevent_info).
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

			} else if(window.confirm('Are you sure you want to exite now?')) {
				clearInterval(this.ctimer);				
				if(this.audio_flag) {
					stopRecording();
				}
				this.onSave();	
				// go dashboard
			}
		}
	}

	prevExamine() {
		if(!this.endbutton && !this.viewexamflag)
			this.onSave();	

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

		this.audiovisibleflag = false;	
		this.quiz_id = this.quiz_list[this.quiz_number];
		this.getProblem(this.quiz_id);	
	}

	nextExamine() {
		if(!this.endbutton && !this.viewexamflag)
			this.onSave();	

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
		
		this.audiovisibleflag = false;	
		this.quiz_id = this.quiz_list[this.quiz_number];
		this.getProblem(this.quiz_id);	
	}

    exitExamine() {
    	clearInterval(this.ctimer);
		if(this.audio_flag) {
			stopRecording();
		}
			
    	if(this.selfexam) { 
    		this.router.navigate(['/quizlist']);
    	} else if(this.viewexamflag) {
    		this.router.navigate(['/examinee']);
    	} else {
    		this.router.navigate(['/test']);
    	}
    	
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
					if(!this.selfexam) { 
						this.http.get("/answer/getanswer/"+this.testevent_id+"/"+data.id).
						map(
							(response) => response.json()
						).
						subscribe(
							(ansdata) => {
								if(typeof ansdata.id == "number") {
									this.currentAnswer = ansdata;									
								} else {
									this.currentAnswer.answer = this.globalService.getSolutionObject(this.currentProblem.type);
									if(this.testvisible) {
										this.currentAnswer.testevent_id = this.testevent_id;					
									} else {
										this.currentAnswer.testevent_id = 0;					
									}
									this.currentAnswer.quiz_id = data.id;	
									this.currentAnswer.evaluate_mark = 0;
								}
							}
						);
					}

					this.currentAnswer.type = data.type;									
					
					this.editordata = this.currentAnswer;
					this.problemdata = this.currentProblem;

					if(this.currentProblem.category=="Speaking") {
						this.audio_flag = true;					
						startRecording(this.currentAnswer.testevent_id, this.currentProblem.id, window.sessionStorage.getItem('userid'), this._token );		
					}

					if(this.selfexam && this.timerflag) {
						this.currentlimittime = Number(data.limit_time).valueOf();	
						this.ctimer = setInterval(()=> {
							this.currentlimittime--; 
							if(this.currentlimittime<=0) 
								this.endExamine(); 
							this.currentAnswer.examine_uptime = this.currentProblem.limit_time - this.currentlimittime;
							this.progressvalue = Math.round(this.currentAnswer.examine_uptime/this.currentProblem.limit_time*100);
						}, 1000 );	
						this.markvisible = false;					
					}
					this.setProblemDetails();
				} else {
					if(this.selfexam && this.timerflag) {
						this.currentlimittime = 0;
					}
					this.currentAnswer.answer = this.globalService.getSolutionObject(this.currentProblem.type);
					alert("No Problem!!!");
				}
			}
		)
	}
	setProblemDetails() {
		switch (this.currentProblem.type) {
			case 'RMA': case 'LSA':
				this.check_answer_val = [];
				this.check_solution_val = [];
				for (var i = 0;  i < this.currentProblem.content.select.options.length;  i++) {
					this.check_answer_val.push(false);
					var sol_val = false; 
					for(var j = 0;  j < this.currentProblem.solution.optionno.length;  j++){
						if(this.currentProblem.solution.optionno[j] == i) {
							sol_val = true;
							break;
						}
					}
					this.check_solution_val.push(sol_val);
				}
				break;
			case 'RRO':
				this.order_left_options = [];
				this.order_right_options = [];
				for (var i = 0;  i < this.currentProblem.content.select.options.length;  i++) {
					this.order_left_options.push(this.currentProblem.content.select.options[i]);
				}
				this.order_left_options.sort();
				this.order_left_options.sort(function(a,b) {    
	        		return Math.random() - Math.random();
	       		});
				break;
			case 'RFB':
				this.rfb_content = this.currentProblem.content.text;
				var reg = /\{\{\}\}/;
                var index = 0;
                var found = reg.test(this.rfb_content);
                while (found) {
                    var matches = reg.exec(this.rfb_content);
                    this.rfb_content = this.rfb_content.replace(reg, "<input type=\"text\" name=\"inputs\" value=\"\">");
                    found = reg.test(this.rfb_content);
                }
                this.rfb_options = [];
                for (var i = 0;  i < this.currentProblem.content.select.options.length;  i++) {
                	this.rfb_options.push(this.currentProblem.content.select.options[i]);
                }
                this.rfb_options.sort();
				this.rfb_options.sort(function(a,b) {    
	        		return Math.random() - Math.random();
	       		});
	       		break;
	       	case 'RAN':
				this.rfb_content = this.currentProblem.content.text;
				var select_list = this.currentProblem.content.selectlist;
				var reg = /\{\{\}\}/;
                var index = 0;
                var found = reg.test(this.rfb_content);
                while (found) {
                    var matches = reg.exec(this.rfb_content);
                    var html = "<select>";
                    for (var j = 0;  j < select_list[index].options.length;  j++) {
                        html = html + "<option value='" + select_list[index].options[j] + "'";
                        if (j == 0)
                            html = html + " selected='1'";
                        html = html + ">" + select_list[index].options[j] + "</option>";
                    }
                    html = html + "</select>";
                    this.rfb_content = this.rfb_content.replace(reg, html);
                    found = reg.test(this.rfb_content);
                    index++;
                }
	       		break;
	       	case 'LTW':
				this.rfb_content = this.currentProblem.content.text;
				var reg = /\{\{\}\}/;
                var index = 0;
                var found = reg.test(this.rfb_content);
                while (found) {
                    var matches = reg.exec(this.rfb_content);
                    this.rfb_content = this.rfb_content.replace(reg, "<input type=\"text\" name=\"inputs\" value=\"\">");
                    found = reg.test(this.rfb_content);
                }
	       		break;
	       	case 'LCD':
				this.rfb_content = this.currentProblem.content.text;
				var reg = /\{\{\}\}/;
                var index = 0;
                var found = reg.test(this.rfb_content);
                while (found) {
                    var matches = reg.exec(this.rfb_content);
                    this.rfb_content = this.rfb_content.replace(reg, this.currentProblem.content.select.options[index++]);
                    found = reg.test(this.rfb_content);
                }
                this.rfb_content = this.rfb_content.replace("<p>", "");
                this.rfb_content = this.rfb_content.replace("</p>", "");
                var arr_str = this.rfb_content.split("&nbsp;");
                this.rfb_content = "";
                for (var i = 0;  i < arr_str.length;  i++) {
                	if (arr_str[i] != '')
                		this.rfb_content += "<span class='LCD'>" + arr_str[i] + "</span> ";
                }
                break;
		}
	}

	createRFBView() {
		if (this.htmldata == null) return;
		var htmldata_obj = this.htmldata.nativeElement;
		var choicepanel_obj = this.choicepanel.nativeElement;

		if ( htmldata_obj.innerHTML == "") {
			
			this.rfb_probhtml = this.rfb_content;

			htmldata_obj.innerHTML = this.rfb_probhtml;
			this.rfb_answerhtml = "<div class='row'>";
			for (var i = 0;  i < this.rfb_options.length;  i++) {
				this.rfb_answerhtml += "<div class='col-2 word' style='text-align: center; border: 1px solid #ccc; background-color: #fff; padding: 10px; margin: 20px 50px; cursor: move;'>" + this.rfb_options[i] + "</div>";
			}
			this.rfb_answerhtml += "</div>";
			
			choicepanel_obj.setAttribute("style", "margin-top: 50px; background-color: #D1E3F8; ");
			choicepanel_obj.innerHTML = this.rfb_answerhtml;

			var left = 0, top = 0;
			var startX = 0, startY = 0;
			var drag_obj:Element = null;
			var container = choicepanel_obj.getElementsByTagName('div');
			var words = container[0].getElementsByTagName('div');
			var inputs = htmldata_obj.getElementsByTagName('input');
			for (var k = 0;  k < inputs.length;  k++) {
				inputs[k].addEventListener('change',
					function(e:any) {
						// $('#choicepanel').find('div.word');
						var inputs = htmldata_obj.getElementsByTagName('input');
						for (var i = 0;  i < words.length;  i++) {
							var flag = 0;
							for (var j = 0;  j < inputs.length;  j++) {
								if (inputs[j].value == words[i].innerHTML) {
									flag = 1;
								}
							}
							if (flag == 1) {
								words[i].style.visibility = "hidden";
							} else {
								words[i].style.visibility = "visible";
							}
						}
					}
				);
			}
			
			for (var i = 0;  i < words.length;  i++) {
				words[i].addEventListener('mousedown',
					function(e:any) {
						if (drag_obj != null)
							return;
						
						e.preventDefault();
						left = 0;
						top = 0;
						startX = e.pageX;
						startY = e.pageY;
						drag_obj = this;
						this.style.left = left;
		                this.style.top = top;
		                //alert('down');
					}
				);
				words[i].addEventListener('mousemove',
					function(e:any) {
						if (drag_obj != this)
							return;
						e.preventDefault();
		                var diffX = e.pageX - startX;
		                var diffY = e.pageY - startY;
		                left = diffX;
		                top = diffY;
		                this.style.left = left + "px";
		                this.style.top = top + "px";
					}
				);
				words[i].addEventListener('mouseup',
					function(e:any) {
						if (drag_obj != this)
							return;
						this.style.visibility = 'hidden';
		 				var point_obj = document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop));
		 				this.style.visibility = 'visible';
		 				var target_obj = point_obj.closest('input');
		 				if (target_obj != null) {
		 					if (target_obj.tagName == "INPUT") {
		 						target_obj.value=this.innerHTML;
								this.style.visibility = 'hidden';
								//$('#html_data input').trigger('change');
		 					}
		 				}
						this.style.left = 0;
		                this.style.top = 0;
		                drag_obj = null;
					}
				);
			}
		}
	}

	createRFBSolutionView() {
		if (this.htmldata == null  ||  this.html_answerdata == null)	return;
		var htmldata_obj = this.htmldata.nativeElement;
		var html_answerdata_obj = this.html_answerdata.nativeElement;

		if (html_answerdata_obj.innerHTML == "") {
			this.rfb_selected_options = [];
            var str_data = htmldata_obj.innerHTML;
            var inputs = htmldata_obj.getElementsByTagName('input');
            for (var i = 0;  i < inputs.length;  i++) {
            	this.rfb_selected_options.push(inputs[i].value);
            }
            this.rfb_content = this.currentProblem.content.text;
            var reg = /\{\{\}\}/;
            var index = 0;
            var found = reg.test(this.rfb_content);
            while (found) {
                var matches = reg.exec(this.rfb_content);
                if (this.rfb_selected_options[index] == this.currentProblem.content.select.options[this.currentProblem.solution.optionno[index]]) {
                	this.rfb_content = this.rfb_content.replace(reg, "<input type=\"text\" value=\"" + this.rfb_selected_options[index] + "\" style=\"color: #f00;\" disabled>");
                } else {
					this.rfb_content = this.rfb_content.replace(reg, "<input type=\"text\" value=\"" + this.rfb_selected_options[index] + "\" disabled>");
                }
                found = reg.test(this.rfb_content);
                index++;
            }
            htmldata_obj.innerHTML = this.rfb_content;

			this.rfb_solutionhtml = this.currentProblem.content.text;
			var reg = /\{\{\}\}/;
            var index = 0;
            var found = reg.test(this.rfb_solutionhtml);
            while (found) {
                var matches = reg.exec(this.rfb_solutionhtml);
                this.rfb_solutionhtml = this.rfb_solutionhtml.replace(reg, "<input type=\"text\" value=\"" + this.currentProblem.content.select.options[this.currentProblem.solution.optionno[index++]] + "\" disabled>");
                found = reg.test(this.rfb_solutionhtml);
            }
            html_answerdata_obj.innerHTML = this.rfb_solutionhtml;
		}
	}

	createRANView() {
		if (this.htmldata == null)	return;
		var htmldata_obj = this.htmldata.nativeElement;
		if (htmldata_obj.innerHTML == "") {
			this.rfb_probhtml = this.rfb_content;
			htmldata_obj.innerHTML = this.rfb_probhtml;
		}
	}

	createRANSolutionView() {
		if (this.htmldata == null  ||  this.html_answerdata == null)	return;
		var htmldata_obj = this.htmldata.nativeElement;
		var html_answerdata_obj = this.html_answerdata.nativeElement;

		if (html_answerdata_obj.innerHTML == "") {
			alert("examinee");
			this.rfb_selected_options = [];
            var str_data = htmldata_obj.innerHTML;
            var selects = htmldata_obj.getElementsByTagName('select');
            for (var i = 0;  i < selects.length;  i++) {
            	this.rfb_selected_options.push(selects[i].value);
            }
            this.rfb_content = this.currentProblem.content.text;
            var reg = /\{\{\}\}/;
            var index = 0;
            var found = reg.test(this.rfb_content);
            while (found) {
                var matches = reg.exec(this.rfb_content);
                if (this.rfb_selected_options[index] == this.currentProblem.content.selectlist[this.currentProblem.solution.optionno[index].id].options[this.currentProblem.solution.optionno[index].option]) {
                	this.rfb_content = this.rfb_content.replace(reg, "<input type=\"text\" value=\"" + this.rfb_selected_options[index] + "\" style=\"color: #f00;\" disabled>");
                } else {
					this.rfb_content = this.rfb_content.replace(reg, "<input type=\"text\" value=\"" + this.rfb_selected_options[index] + "\" disabled>");
                }
                found = reg.test(this.rfb_content);
                index++;
            }
            htmldata_obj.innerHTML = this.rfb_content;

			this.rfb_solutionhtml = this.currentProblem.content.text;
			var reg = /\{\{\}\}/;
            var index = 0;
            var found = reg.test(this.rfb_solutionhtml);
            while (found) {
                var matches = reg.exec(this.rfb_solutionhtml);
                this.rfb_solutionhtml = this.rfb_solutionhtml.replace(reg, "<input type=\"text\" value=\"" + this.currentProblem.content.selectlist[this.currentProblem.solution.optionno[index].id].options[this.currentProblem.solution.optionno[index++].option] + "\" disabled>");
                found = reg.test(this.rfb_solutionhtml);
            }
            html_answerdata_obj.innerHTML = this.rfb_solutionhtml;
		}
	}

	createLTWView() {
		if (this.htmldata == null)	return;
		var htmldata_obj = this.htmldata.nativeElement;
		if (htmldata_obj.innerHTML == "") {
			this.rfb_probhtml = this.rfb_content;
			htmldata_obj.innerHTML = this.rfb_probhtml;
		}
	}

	createLTWSolutionView() {
		if (this.htmldata == null  ||  this.html_answerdata == null)	return;
		var htmldata_obj = this.htmldata.nativeElement;
		var html_answerdata_obj = this.html_answerdata.nativeElement;

		if (html_answerdata_obj.innerHTML == "") {
			this.rfb_selected_options = [];
            var str_data = htmldata_obj.innerHTML;
            var inputs = htmldata_obj.getElementsByTagName('input');
            for (var i = 0;  i < inputs.length;  i++) {
            	this.rfb_selected_options.push(inputs[i].value);
            }
            this.rfb_content = this.currentProblem.content.text;
            var reg = /\{\{\}\}/;
            var index = 0;
            var found = reg.test(this.rfb_content);
            while (found) {
                var matches = reg.exec(this.rfb_content);
                if (this.rfb_selected_options[index] == this.currentProblem.content.select.options[index]) {
                	this.rfb_content = this.rfb_content.replace(reg, "<input type=\"text\" value=\"" + this.rfb_selected_options[index] + "\" style=\"color: #f00;\" disabled>");
                } else {
					this.rfb_content = this.rfb_content.replace(reg, "<input type=\"text\" value=\"" + this.rfb_selected_options[index] + "\" disabled>");
                }
                found = reg.test(this.rfb_content);
                index++;
            }
            htmldata_obj.innerHTML = this.rfb_content;

			this.rfb_solutionhtml = this.currentProblem.content.text;
			var reg = /\{\{\}\}/;
            var index = 0;
            var found = reg.test(this.rfb_solutionhtml);
            while (found) {
                var matches = reg.exec(this.rfb_solutionhtml);
                this.rfb_solutionhtml = this.rfb_solutionhtml.replace(reg, "<input type=\"text\" value=\"" + this.currentProblem.content.select.options[index++] + "\" disabled>");
                found = reg.test(this.rfb_solutionhtml);
            }
            html_answerdata_obj.innerHTML = this.rfb_solutionhtml;
		}
	}

	isMember(element: any, classname: any) {
        var classes = element.className;  // Get the list of classes
        if (!classes) return false;             // No classes defined
        if (classes == classname) return true;  // Exact match

        var whitespace = /\s+/;
        if (!whitespace.test(classes)) return false;

        var c = classes.split(whitespace);  // Split with whitespace delimiter
        for(var i = 0; i < c.length; i++) { // Loop through classes
            if (c[i] == classname) return true;  // and check for matches
        }

        return false;  // None of the classes matched
    }

    getElements(classname: any, tagname: any, root: any) {
	    if (!root) root = document;
	    else if (typeof root == "string") root = document.getElementById(root);
		
		if (!tagname) tagname = "15-";

	    var all = root.getElementsByTagName(tagname);

	    if (!classname) return all;

	    var elements = [];  // Start with an empty array
	    for(var i = 0; i < all.length; i++) {
	        var element = all[i];
	        if (this.isMember(element, classname)) // isMember() is defined below
	            elements.push(element);       // Add class members to our array
	    }

	    return elements;
	}

	createLCDView() {
		if (this.htmldata == null)	return;
		var htmldata_obj = this.htmldata.nativeElement;
		if (htmldata_obj.innerHTML == "") {
			this.rfb_probhtml = this.rfb_content;
			htmldata_obj.innerHTML = this.rfb_probhtml;
			var spans = htmldata_obj.getElementsByTagName('span');
			for (var i = 0;  i < spans.length;  i++) {
				spans[i].addEventListener('click',
					function(e:any) {
						var classes = this.className;  // Get the list of classes
				        if (!classes) return;             // No classes defined
				        if (classes == "LCD") {
				        	this.className += " Clicked";
				        	return;  // Exact match
				        }

				        var flag1 = false, flag2 = false;
				        if (this.className.search("\\b" + "LCD" + "\\b") != -1) {
				        	flag1 = true;
				        }
				        if (this.className.search("\\b" + "Clicked" + "\\b") != -1) {
				        	flag2 = true;
				        }
				        
				        if (flag1 == true) {
				        	if (flag2 == true)
				        		this.className = this.className.replace(new RegExp("\\b"+ "Clicked"+"\\b\\s*", "g"), "");
				        	else
				        		this.className += " Clicked";
				        }
					}
				);
			}
		}
	}

	createLCDSolutionView() {
		if (this.htmldata == null  ||  this.html_answerdata == null)	return;
		var htmldata_obj = this.htmldata.nativeElement;
		var html_answerdata_obj = this.html_answerdata.nativeElement;

		if (html_answerdata_obj.innerHTML == "") {
			var LCD_spans = this.getElements('LCD', 'span', htmldata_obj);
			for (var i = 0;  i < LCD_spans.length;  i++)
				LCD_spans[i].className = LCD_spans[i].className.replace(new RegExp("\\b"+ "LCD"+"\\b\\s*", "g"), "");
			var spans = htmldata_obj.getElementsByTagName('span');
			for (var i = 0;  i < spans.length;  i++) {
				if (spans[i].className == '')
					spans[i].removeAttribute('class');
			}

			var answer_words = [];
			var str_data = htmldata_obj.innerHTML;
			var reg = /(<span[ class=\"Clicked\"]*>)([a-z, ,|]*)(<\/span>)/;
            var found = reg.test(str_data);
            while (found) {
                var matches = reg.exec(str_data);
                str_data = str_data.replace(reg, "{{}}");
                answer_words.push(matches[0]);
                found = reg.test(str_data);
            }
            this.rfb_content = "";
            for (var i = 0;  i < answer_words.length;  i++) {
            	this.rfb_content += answer_words[i] + " ";
            }
            htmldata_obj.innerHTML = this.rfb_content;

            var solution_words = [];
            this.rfb_solutionhtml = this.currentProblem.content.text;
			this.rfb_solutionhtml = this.rfb_solutionhtml.replace("<p>", "");
            this.rfb_solutionhtml = this.rfb_solutionhtml.replace("</p>", "");
            var arr_words = this.rfb_solutionhtml.split("&nbsp;");
            for (var i = 0;  i < arr_words.length;  i++) {
            	if (arr_words[i] != '')
            		solution_words.push("<span>" + arr_words[i] + "</span>");
            }
            var index = 0;
            for (var i = 0;  i < solution_words.length;  i++) {
            	var reg = /\{\{\}\}/;
            	var found = reg.test(solution_words[i]);
            	if (found) {
            		solution_words[i] = "<span class=\"Clicked\">" + this.currentProblem.content.select.options[index++] + "</span>";
            	}
            }
            this.rfb_solutionhtml = "";
            for (var i = 0;  i < solution_words.length;  i++) {
            	this.rfb_solutionhtml += solution_words[i] + " ";
            }
            html_answerdata_obj.innerHTML = this.rfb_solutionhtml;

            var spans = htmldata_obj.getElementsByTagName('span');
            for (var i = 0;  i < solution_words.length;  i++) {
            	if (answer_words[i] != solution_words[i]) {
            		spans[i].className = spans[i].className + " Wrong";
            	} else if (solution_words[i].indexOf('Clicked') >= 0){
            		spans[i].className = spans[i].className + " Correct";
            	}
            }
		}
	}

	getAnswers() {
		this.http.get("/answer/getlist").
		map(
			(response) => response.json()
		).
		subscribe(
			(data) => {
				this.httpdata = data;	
			}
		)
	}


	

	evaluateExamine() {
		// evaluation examinee
		var eval_point = Math.round(Math.random() * Number(this.currentProblem.points).valueOf());
		
		if(!this.selfexam) {
			if(this.arrchecknumber.indexOf(this.quiz_number) > -1) {
				this.curtotalpoint += Number(eval_point).valueOf() - this.currentAnswer.evaluate_mark;			
			} else {
				this.arrchecknumber.push(this.quiz_number);
				this.curtotalpoint += Number(eval_point).valueOf();
				this.stdtotalpoint += Number(this.currentProblem.points).valueOf();
			}
		}
		
		this.currentAnswer.evaluate_mark = eval_point;
	}

	onSave(endFlag: boolean = false) {
		if(typeof this.currentAnswer.quiz_id == "number") {
			//this.evaluateExamine();		
			if(endFlag){
				//this.evaluateTest();
			}

			this.http.post("/answer/insert", this.currentAnswer).
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

    onClickDelete(id: number) {
    	if(window.confirm('Are you sure you want to delete?')) {
	    	this.http.get("/answer/delete/"+id).
	    	map(
	            (response) => response.json()
	        ).
	        subscribe(
	    		(data) => {
	    			if(data.state == "error") {
	    				alert(data.message);
	    			}
	    			this.getAnswers();
	    		}
	    	);
	    }
    }

    showViewExamineAnswerForm( ans: Answer) {

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
/* =========================== RSA || LSB ========================= */
	onClickRadio() {
		this.currentAnswer.answer.optionno = "";
		for (var i = 0;  i < this.currentProblem.content.select.options.length;  i++) {
			if (this.radio_answer_val == this.currentProblem.content.select.options[i]) {
				this.currentAnswer.answer.optionno = i;
			}
		}
	}
/* =========================== RMA || LSA ========================= */
	onClickCheck() {
		this.currentAnswer.answer.optionno = [];
		for (var i = 0;  i < this.currentProblem.content.select.options.length;  i++) {
			if (this.check_answer_val[i] == true) {
				this.currentAnswer.answer.optionno.push(i);
			}
		}
	}
/* =========================== RRO ========================= */
	onChangeLeftSelect() {
	}
	onChangeRightSelect() {
	}
	onRight() {
		var selCount = this.select_left_values.length;
        if (selCount != 1)
        	return;
		for (var i = 0;  i < this.order_left_options.length;  i++) {
    		if (this.select_left_values[0] == this.order_left_options[i]) {
				this.order_right_options.push(this.select_left_values[0]);
				this.order_left_options.splice(i, 1);
				this.select_left_values = [];
				break;
			}
    	}
	}
	onLeft() {
		var selCount = this.select_right_values.length;
        if (selCount != 1)
        	return;
		for (var i = 0;  i < this.order_right_options.length;  i++) {
    		if (this.select_right_values[0] == this.order_right_options[i]) {
				this.order_left_options.push(this.select_right_values[0]);
				this.order_right_options.splice(i, 1);
				this.select_right_values = [];
				break;
			}
    	}
	}
	onUp() {
		var selCount = this.select_right_values.length;
        if (selCount != 1)
        	return;
		var sel_val = this.select_right_values[0];
        var options = this.order_right_options;
        var i = 0;
        for (i = 0;  i < options.length;  i++) {
            if (sel_val == options[i])
                break;
        }
        if (i > 0) {
            var tmp = options[i];
            options[i] = options[i - 1];
            options[i - 1] = tmp;
        }
	}
	onDown() {
		var selCount = this.select_right_values.length;
        if (selCount != 1)
        	return;
		var sel_val = this.select_right_values[0];
        var options = this.order_right_options;
        var i = 0;
        for (i = 0;  i < options.length;  i++) {
            if (sel_val == options[i])
                break;
        }
        if (i < options.length - 1) {
            var tmp = options[i];
            options[i] = options[i + 1];
            options[i + 1] = tmp;
        }
	}
}
