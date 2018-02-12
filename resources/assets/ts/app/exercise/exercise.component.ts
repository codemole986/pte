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
import { TypeRenderComponent } from '../test/type-render.component';

@Component({
  	selector: 'app-exercise',
  	template: require('./exercise.component.html'),
	styles: [`${require('./exercise.component.css')}`],	
    animations: [routerTransition()],
	providers: [GlobalService]  
})
export class ExerciseComponent implements OnInit {
	currentProblem: Problem;
	currentAnswer: Answer;
	currentlimittime: number;
	quiz_count: number = 0;
	endbutton: boolean;
	nextability: boolean = true;
	prevability: boolean = true;	
	nextbutton: boolean;
	previousbutton: boolean;	
	solutiontextvisible: boolean;
	markvisible: boolean;
	ctimer: any;
	i: number;
	arr_types: any[];

	radio_answer_val: string;
	check_answer_val: any[];
	check_solution_val: any[];

	select_left_values: any[];
	select_right_values: any[];
	order_left_options: any[];
	order_right_options: any[];

	audio_flag: boolean = false;
	audio_autoplay: boolean;

	rfb_content: string;
	rfb_probhtml: string;
	rfb_answerhtml: string;
	rfb_solutionhtml: string;
	rfb_options: any[];
	rfb_selected_options: any[];

	ran_content: string;
	ran_selectlist: any[];

	@ViewChild('htmldata') htmldata: ElementRef;
	@ViewChild('choicepanel') choicepanel: ElementRef;
	@ViewChild('html_answerdata') html_answerdata: ElementRef;

	quiz_id: number;
	progressvalue: number;
	audiovisibleflag : boolean = false;

	listflag : boolean = true;
	exercisegridsettings: any;
    exercisedatasource: ServerDataSource;
	
	_token : string = window.sessionStorage.getItem('_token');

	constructor(private http: Http, private route: ActivatedRoute, private router: Router, private globalService: GlobalService) { 
		this.quiz_id = 0;
		this.markvisible = false;
		this.currentProblem = new Problem;
		this.currentProblem.type = "WSM";	
		this.currentProblem.content = this.globalService.getContentObject(this.currentProblem.type);
		this.currentAnswer = new Answer;	
		this.currentAnswer.answer = this.globalService.getSolutionObject(this.currentProblem.type);			
	}

	ngOnInit() {		
		this.quiz_id = this.route.snapshot.params['id'];
		if(this.quiz_id!=null) {
			this.listflag = false;
			this.getProblem(this.quiz_id);									
		} else {
			this.listflag = true;
		}

		this.exercisegridsettings = {
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
                id: 'exercisetestgrid',
                class: 'table table-bordered table-hover table-striped',
            },
            noDataMessage: 'No data found',            
            pager: {
                display: true,
                perPage: 15,
            },
            columns: {
            	created_at: {
                	title: "date",
                },
                email: {
                	title: "Creater"
                },
                category: {
                	title: "Category",
                },
                type: {
                    title: 'Type',
                    type: 'custom',
                    renderComponent: TypeRenderComponent,
                },
                degree: {
                	title: "Degree",
                },
                title: {
                	title: "QuizTitle",	
                },
                limit_time: {
                	title: "LimitTime"
                },
                points: {
                	title: "Points"
                },
                evaluate_mode: {
                	title: "Mode"
                },
                evaluate_mark: {
                	title: "Mode"
                }
            }
        };

        this.exercisedatasource = new ServerDataSource(this.http, {totalKey: "total", dataKey: "data", endPoint: '/answer/getexerciseanswers' });
	}

	evaluateExercise() {
		var eval_point = Math.round(Math.random() * Number(this.currentProblem.points).valueOf());
		
		this.currentAnswer.evaluate_mark = eval_point;
	}

	saveExercise() {
		console.log("amswer quiz_id:");	
		console.log(this.currentAnswer.quiz_id);
		if(typeof this.currentAnswer.quiz_id == "number") {
			//this.evaluateExercise();		
			
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

	endExercise() {
		clearInterval(this.ctimer);
		this.saveExercise();
		this.endbutton = true;	
		this.nextbutton = this.nextability;
		this.previousbutton = this.prevability;	
		this.markvisible = true;
			
		if(this.audio_flag) {
			stopRecording();
			this.audiovisibleflag = true;
		}
	}

	nextExercise() {
		this.saveExercise();
		this.quiz_count++;
		this.audiovisibleflag = false;
		this.http.get("/problem/getnextproblemid/"+this.quiz_id).
		map(
			(response) => response.json()
		).
		subscribe(
			(data) => {
				if(typeof data.id == "number") {
					this.quiz_id = data.id;
					if(data.count > 0) {
						this.nextability = true;
						this.nextbutton = false;
						this.endbutton = false;
						this.previousbutton = false;
						this.solutiontextvisible = false;												
						this.getProblem(this.quiz_id);
						this.prevability = true;										
					} else {
						this.nextability = false;
					}
				} else {
					this.nextbutton = false;
					this.nextability = false;
				}
			}
		);
	}

	prevExercise() {
		this.saveExercise();
		this.quiz_count++;
		this.audiovisibleflag = false;
		this.http.get("/problem/getprevproblemid/"+this.quiz_id).
		map(
			(response) => response.json()
		).
		subscribe(
			(data) => {
				if(typeof data.id == "number") {
					this.quiz_id = data.id;
					if(data.count > 0) {
						this.prevability = true;
						this.nextbutton = false;
						this.endbutton = false;
						this.previousbutton = false;
						this.solutiontextvisible = false;												
						this.getProblem(this.quiz_id);	
						this.nextability = true;									
					} else {
						this.prevability = false;
					}
				} else {
					this.previousbutton = false;
					this.prevability = false;
				}
			}
		);
	}

	exitExercise() {
		clearInterval(this.ctimer);
		if(this.audio_flag) {
			stopRecording();
		}
		this.router.navigate(['/quizlist']);
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
					this.currentAnswer.testevent_id = 0;	
					this.currentAnswer.quiz_id = data.id;	
					this.currentAnswer.evaluate_mark = 0;			
					this.currentAnswer.type = data.type;									
					
					if(this.currentProblem.category=="Speaking") {
						this.audio_flag = true;	
						startRecording(0, data.id, window.sessionStorage.getItem('userid'), this._token);		
					}

					this.currentlimittime = Number(data.limit_time).valueOf();	
					this.ctimer = setInterval(()=> {
						this.currentlimittime--; 
						
						if(this.currentlimittime<=0) 
							this.endExercise(); 

						this.currentAnswer.examine_uptime = this.currentProblem.limit_time - this.currentlimittime;
						this.progressvalue = Math.round(this.currentAnswer.examine_uptime/this.currentProblem.limit_time*100);
					}, 1000 );	
					this.markvisible = false;					
					this.setProblemDetails();
				} else {
					this.currentAnswer.answer = this.globalService.getSolutionObject(this.currentProblem.type);
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

}
