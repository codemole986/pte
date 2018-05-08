import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Router, ActivatedRoute, ActivationEnd  } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { routerTransition } from '../router.animations';
import { GlobalService } from '../shared/services/global.service';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { Problem } from '../model/problem';
import { Answer } from '../model/answer';
import { TypeRenderComponent } from '../test/type-render.component';
import { TranslateService } from '@ngx-translate/core';

declare var $:any;
declare function startRecording(a: any, b: any, c: any, d: any): any;
declare function stopRecording(): any;
declare var bootbox: any;
declare var Metronic: any;
declare var Datatable: any;
declare var SC: any;

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
	currentpretime: number;
	currentlimittime: number;
	quiz_count: number = 0;
	endbutton: boolean;
	againbutton: boolean;
	nextbutton: boolean;
	previousbutton: boolean;	
	solutiontextvisible: boolean;
	markvisible: boolean;
	quiz_step: number;
	ctimer: any;
	i: number;
	arr_types: any[];

	radio_answer_val: string;
	check_answer_val: any[];
	check_solution_val: any[];

	select_left_values: any[];
	select_right_values: any[];
	order_options: any[];
	order_left_options: any[];
	order_right_options: any[];

	audio_flag: boolean = false;
	audio_autoplay: boolean;

	sel_audio_index: number;
	audio_visible_flag: boolean;
	record_start_time: number;
	end_exam_flag: boolean;

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
	nextquiz_id: number;
	prevquiz_id: number;
	progressvalue: number;
	audiovisibleflag : boolean = false;

	listflag : boolean = true;
	
	_token : string = window.sessionStorage.getItem('_token');
	active_menu: string = "overview";

	quiztype: string;
	quizgrid: any;
	quizno: number;
	
  constructor(private http: Http, private route: ActivatedRoute, private router: Router, private globalService: GlobalService, private translate: TranslateService) {
		this.quiz_id = 0;
		this.markvisible = false;
		this.currentProblem = new Problem;
		this.currentProblem.type = "WSM";	
		this.currentProblem.content = this.globalService.getContentObject(this.currentProblem.type);
		this.currentAnswer = new Answer;	
		this.currentAnswer.answer = this.globalService.getSolutionObject(this.currentProblem.type);	

		this.audio_flag = false;
		this.audio_autoplay = false;

		this.sel_audio_index = -1;
		this.audio_visible_flag = false;
		this.record_start_time = 0;
		this.quiztype = "";

		var that = this;
		this.router.events.subscribe((val: any) => {			
    	if (val instanceof ActivationEnd) {
    		if(val.snapshot.routeConfig.path.indexOf("exercise") < 0 ) return;

        console.log("snapshot check1.", val.snapshot);

        that.quiz_id = val.snapshot.params['id'];
				that.quiztype = val.snapshot.params['type'];

				if (that.quiz_id != null) {
					that.listflag = false;					
					clearInterval(this.ctimer);
					that.getProblem(that.quiz_id);
				} else if (that.quiztype != null) {
					that.listflag = false;									
					clearInterval(this.ctimer);
					that.getFirstProblem(that.quiztype);
					that.quizno = 1;
				} else {
					that.listflag = true;
				}
				if(typeof that.quizgrid !== "undefined")
					that.quizgrid.ajax.reload('', true);
		        that.initialize();
      }
    });
	}

	ngOnInit() {
    Metronic.init();

		switch(window.sessionStorage.getItem('permission')) {
  		case 'A' : this.active_menu = "manage"; break;
			case 'B' : this.active_menu = "teacher"; break;
			case 'D' : this.active_menu = "student"; break;
			default : this.active_menu = "overview";
  	}

  	var that = this;
  	setTimeout(function(){
    	that.quizgrid = $("#quiztable").DataTable({
        serverSide: true,
        stateSave: false,

        "ordering": false,
        "info": true,
        "searching": true,  

        "ajax": {
          "type": "GET",
          "async": true,
          "url": "/problem/getproblemswithtype",
          "data": function (d: any) {
          	d.type = that.quiztype;
          	return d;
          },                   
          "dataSrc": "data",	
          "dataType": "json",
          "cache":    false,
        },
        
        columns:[
        	{title: "No", data:"no"}, 
          {title: "Title", data:"title"}, 
          {title: "LimitTime(s)", data:"limit_time"}, 
        ], 

        scrollY: false,
        scrollX: false,
        scrollCollapse: false,
        jQueryUI: true,  

        "lengthMenu": [
              [5, 10, 20, 50, 150],
              [5, 10, 20, 50, 150] // change per page values here
          ],

        "paging": true,
        "pagingType": "full_numbers",           
        "pageLength": 10, 

        //dom: "tBpi",           
        "dom": '<"top">irft<"bottom"rp><"clear">',
      });

      var that2 = that;
      $('#quiztable tbody').on( 'dblclick', 'tr', function () {
        if ( !$(this).hasClass('selected') ) {
          that2.quizgrid.$('tr.selected').removeClass('selected');
          $(this).addClass('selected');
        }

				var selected_rowdata = that2.quizgrid.row('.selected').data();

				that2.listflag = false;
				clearInterval(that2.ctimer);
				that2.getProblem(selected_rowdata.id);
				that2.quizno = selected_rowdata.no;
				that2.initialize();
			}); 
    }, 500);
  }

  drawQuizGrid() {
  	this.quizgrid.ajax.reload('', false);
	}

	ngOnDestroy() {
    clearInterval(this.ctimer);
  }

	initialize() {
		this.nextquiz_id = 0;
		this.prevquiz_id = 0;
		this.previousbutton = true;
		this.nextbutton = true;
		this.againbutton = false;
		this.quiz_count = 0;
	}

	evaluateExercise() {
		var eval_point = Math.round(Math.random() * Number(this.currentProblem.points).valueOf());
		
		this.currentAnswer.evaluate_mark = eval_point;
	}

	saveExercise() {
		if(typeof this.currentAnswer.quiz_id == "number") {
			//this.evaluateExercise();		
			
			this.http.post("/answer/insert", this.currentAnswer)
        .map(
          (response) => response.json()
        )
        .subscribe(
	    		(data) => {
	    			if(data.state == "error") {
	    				Metronic.showErrMsg(data.message);	
	    			}    			
	    		}
	    	);
		}
  }

  startExercise() {
  	this.quiz_step = 1;
		clearInterval(this.ctimer);

		this.currentlimittime = Number(this.currentProblem.limit_time).valueOf();

		if (!(this.currentProblem.type == 'SRS' || this.currentProblem.type == 'SSA' || this.currentProblem.type == 'SRL' || this.currentProblem.type == 'LWS' || this.currentProblem.type == 'LTS' || this.currentProblem.type == 'LSA' || this.currentProblem.type == 'LSB')) {

			this.ctimer = setInterval(()=> {
				this.currentlimittime--; 
				this.currentAnswer.examine_uptime = this.currentProblem.limit_time - this.currentlimittime - this.record_start_time;
				this.progressvalue = Math.round(this.currentAnswer.examine_uptime/(this.currentProblem.limit_time - this.record_start_time)*100);

				if(this.currentlimittime<=0) 
					this.endExercise(); 
			}, 1000 );	
		}

		this.markvisible = false;
  }

	endExercise() {
		clearInterval(this.ctimer);
		this.saveExercise();
		this.endbutton = true;	
		this.againbutton = true;
		
		if(this.currentProblem.type == 'SRS' || this.currentProblem.type == 'SSA' || this.currentProblem.type == 'LWS' || this.currentProblem.type == 'LTS' || this.currentProblem.type == 'LSA' || this.currentProblem.type == 'LTW' || this.currentProblem.type == 'LSB' || this.currentProblem.type == 'LCD') {
			if ($('#quizaudio')[0] != null) {
				$('#quizaudio')[0].pause();
				$('#quizaudio')[0].currentTime = 0;
			}
		}

		/*if (this.currentProblem.type == 'LTW') {
			var htmldata_obj = this.htmldata.nativeElement;
			var inputs = $(htmldata_obj).find('input');
			$(inputs).attr("disabled", "");
		} else if (this.currentProblem.type == 'LCD') {
			var htmldata_obj = this.htmldata.nativeElement;
			var LCD_spans = $(htmldata_obj).find("span.LCD");
			$(LCD_spans).removeClass("LCD");
		} else if (this.currentProblem.type == 'RFB') {
			var htmldata_obj = this.htmldata.nativeElement;
			var choicepanel_obj = this.choicepanel.nativeElement;
			var inputs = $(htmldata_obj).find('input');
			$(inputs).attr("disabled", "");
		} else if (this.currentProblem.type == 'RAN') {
			var htmldata_obj = this.htmldata.nativeElement;
			var selects = $(htmldata_obj).find('select');
			$(selects).attr("disabled", "");
		}*/

		if(this.nextquiz_id > 0)
			this.nextbutton = true;

		if(this.prevquiz_id > 0)
			this.previousbutton = true;	

		this.markvisible = true;
			
		if(this.audio_flag) {
			stopRecording();
			this.audiovisibleflag = true;
		}

		this.end_exam_flag = true;
		this.audio_visible_flag = false;
	}

	againExercise() {
		//this.saveExercise();
		clearInterval(this.ctimer);
		this.quiz_count++;
		this.audiovisibleflag = false;
		this.againbutton = false;
		this.getProblem(this.quiz_id);	
	}

	nextExercise() {
		//this.saveExercise();
		clearInterval(this.ctimer);
		if(this.nextquiz_id > 0) {
		this.quizno+=1;
		this.quiz_count++;
		this.audiovisibleflag = false;
		this.getProblem(this.nextquiz_id);
		} else {
			this.againbutton = true;
		}
	}

	prevExercise() {
		//this.saveExercise();
		clearInterval(this.ctimer);
		if(this.prevquiz_id > 0) {
		this.quizno-=1;
		this.quiz_count++;
		this.audiovisibleflag = false;
		this.getProblem(this.prevquiz_id);
		} else {
			this.againbutton = true;
		}
	}

	exitExercise() {
		clearInterval(this.ctimer);
		if(this.audio_flag) {
			stopRecording();
		}
		this.router.navigate(['/exerciselist']);
	}

	getFirstProblem(qtype: string) {
		var that = this;
		this.http.get("/problem/getfirstproblem/"+qtype).
		map(
			(response) => response.json()
		).
		subscribe(
			(data) => {
				if (typeof data.problem === "undefined") {
					that.router.navigate(['/dashboard']);
					return;
				}
				if(typeof data.problem.id == "number") {
					that.quiz_id = data.problem.id;
					that.previousbutton = true;
					if(typeof data.prevqid == "number") {
						that.prevquiz_id = data.prevqid;
					} else {
						that.prevquiz_id = 0;
					}

					that.nextbutton = true;
					if(typeof data.nextqid == "number") {
						that.nextquiz_id = data.nextqid;
					} else {
						that.nextquiz_id = 0;
					}

					that.endbutton = false;
					that.solutiontextvisible = false;

					that.currentProblem = data.problem;	
					that.currentAnswer = new Answer;	
					that.currentAnswer.answer = that.globalService.getSolutionObject(that.currentProblem.type);	
					that.currentAnswer.testevent_id = 0;	
					that.currentAnswer.quiz_id = data.problem.id;	
					that.currentAnswer.evaluate_mark = 0;			
					that.currentAnswer.type = that.currentProblem.type;									
					
					that.record_start_time = 0;	
					that.quiz_step = 0;
					clearInterval(that.ctimer);
					if(that.audio_flag) {
						stopRecording();
					}
					that.audio_flag = false;
					that.progressvalue = 0;
					that.end_exam_flag = false;

					that.currentpretime = Number(data.problem.preparation_time).valueOf();	
					that.ctimer = setInterval(()=> {
						that.currentpretime--; 
						
						if(that.currentpretime<=0) {
							that.startExercise();

							if (data.problem.type == 'SAL' || data.problem.type == 'SPI') {
								that.audio_flag = true;
								
								startRecording(that.currentAnswer.testevent_id, that.currentProblem.id, window.sessionStorage.getItem('userid'), that._token );
								that.record_start_time = that.currentProblem.limit_time - that.currentlimittime;
								that.progressvalue = 0;
							}
							that.audio_visible_flag = false;
						}
					}, 1000 );	

					that.markvisible = false;		
					that.setProblemDetails();
				} else {
					that.currentAnswer.answer = that.globalService.getSolutionObject(that.currentProblem.type);
				}
			}
		);
	}

	getProblem(qid: number) {		
		if(qid > 0) {
		var that = this;
		this.http.get("/problem/getfullproblem/"+qid).
		map(
			(response) => response.json()
		).
		subscribe(
			(data) => {
				if(typeof data.problem.id == "number") {
						that.quiz_id = data.problem.id;
						that.previousbutton = true;
					if(typeof data.prevqid == "number") {
						that.prevquiz_id = data.prevqid;
					} else {
						that.prevquiz_id = 0;
					}

						that.nextbutton = true;
					if(typeof data.nextqid == "number") {
						that.nextquiz_id = data.nextqid;
					} else {
						that.nextquiz_id = 0;
					}

					that.endbutton = false;
					that.solutiontextvisible = false;

					that.currentProblem = data.problem;	
					that.currentAnswer = new Answer;	
					that.currentAnswer.answer = that.globalService.getSolutionObject(that.currentProblem.type);	
					that.currentAnswer.testevent_id = 0;	
					that.currentAnswer.quiz_id = data.problem.id;	
					that.currentAnswer.evaluate_mark = 0;			
					that.currentAnswer.type = that.currentProblem.type;									
					
					that.record_start_time = 0;	
					that.quiz_step = 0;
					clearInterval(that.ctimer);
					if(that.audio_flag) {
						stopRecording();
					}
					that.audio_flag = false;
					that.progressvalue = 0;
					that.end_exam_flag = false;

					that.currentpretime = Number(data.problem.preparation_time).valueOf();	
					that.ctimer = setInterval(()=> {
						that.currentpretime--; 
						
						if(that.currentpretime<=0) {
							that.startExercise(); 
						
							if (data.problem.type == 'SAL' || data.problem.type == 'SPI') {
								that.audio_flag = true;
							
								startRecording(that.currentAnswer.testevent_id, that.currentProblem.id, window.sessionStorage.getItem('userid'), that._token );
								that.record_start_time = that.currentProblem.limit_time - that.currentlimittime;
								that.progressvalue = 0;
							}
							that.audio_visible_flag = false;
						}
					}, 1000 );	

					that.markvisible = false;		
					that.setProblemDetails();
				} else {
					that.currentAnswer.answer = that.globalService.getSolutionObject(that.currentProblem.type);
				}
			}
			);
		}
		
	}

	setProblemDetails() {
		switch (this.currentProblem.type) {
			case 'WSM':
				if (this.htmldata != null) {
	       			this.htmldata.nativeElement.innerHTML = "";
	       			this.createWSMView();
	       		}
				break;
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
				this.order_options = [];
				this.order_left_options = [];
				this.order_right_options = [];
				for (var i = 0;  i < this.currentProblem.content.select.options.length;  i++) {
					this.order_options.push(this.currentProblem.content.select.options[i]);
				}
				this.order_options.sort();
				this.order_options.sort(function(a,b) {    
	        		return Math.random() - Math.random();
	       		});
	       		for (var i = 0;  i < this.order_options.length;  i++) {
	       			this.order_left_options.push(this.order_options[i]);
	       		}
				break;
			case 'RFB':
				this.rfb_content = this.currentProblem.content.text;
				var reg = /\{\{\}\}/;
                var index = 0;
                var found = reg.test(this.rfb_content);
                while (found) {
                    var matches = reg.exec(this.rfb_content);
                    this.rfb_content = this.rfb_content.replace(reg, "<input type=\"text\" name=\"inputs\" value=\"\"><a class=\"btn default eraser\"><i class=\"fa fa-times\"></i></a>");
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

	       		if (this.htmldata != null) {
	       			this.htmldata.nativeElement.innerHTML = "";
	       			this.createRFBView();
	       		}
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

                if (this.htmldata != null) {
	       			this.htmldata.nativeElement.innerHTML = "";
	       			this.createRANView();
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

                if (this.htmldata != null) {
	       			this.htmldata.nativeElement.innerHTML = "";
	       			this.createLTWView();
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

                if (this.htmldata != null) {
	       			this.htmldata.nativeElement.innerHTML = "";
	       			this.createLCDView();
	       		}
                break;
		}
	}

	checkRFBInputs() {
		var htmldata_obj = this.htmldata.nativeElement;
		var choicepanel_obj = this.choicepanel.nativeElement;
		var container = choicepanel_obj.getElementsByTagName('div');
		var words = container[0].getElementsByTagName('div');
		var inputs = htmldata_obj.getElementsByTagName('input');
		for (var i = 0;  i < words.length;  i++) {
			var flag = 0;
			var j;
			for (j = 0;  j < inputs.length;  j++) {
				if (inputs[j].value == words[i].innerHTML) {
					flag = 1;
					break;
				}
			}
			if (flag == 1) {
				words[i].style.visibility = "hidden";
			} else {
				words[i].style.visibility = "visible";
			}
		}
	}

	createWSMView() {
		if (this.htmldata == null) return;
		var htmldata_obj = this.htmldata.nativeElement;
		
		if ( htmldata_obj.innerHTML == "") {
			htmldata_obj.innerHTML = this.currentProblem.content.text;
		}
	}

	createRFBView() {
		if (this.htmldata == null) return;
		if (this.choicepanel == null) return;
		var htmldata_obj = this.htmldata.nativeElement;
		var choicepanel_obj = this.choicepanel.nativeElement;

		if ( htmldata_obj.innerHTML == "") {
			
			this.rfb_probhtml = this.rfb_content;
			this.rfb_probhtml = this.rfb_probhtml.replace("<p>", "");
            this.rfb_probhtml = this.rfb_probhtml.replace("</p>", "");
			htmldata_obj.innerHTML = this.rfb_probhtml;
			this.rfb_answerhtml = "<div class='row'>";
			for (var i = 0;  i < this.rfb_options.length;  i++) {
				this.rfb_answerhtml += "<div class='col-md-2 col-sm-3 col-xs-10 word'>" + this.rfb_options[i] + "</div>";
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
			var erasers = $(htmldata_obj).find('a.eraser');
			var that = this;
			for (var k = 0;  k < inputs.length;  k++) {
				inputs[k].addEventListener('keydown',
					function(e:any) {
						var input = e.target;
						setTimeout(function(){
				                input.value = '';
				                that.checkRFBInputs();
				            },
				        10);
								}
				);
				erasers[k].addEventListener('click', function(e:any) {
					var eraser = e.target;
					if ($(eraser).context.tagName == "I") {
						eraser = $(eraser).parent('a.eraser')[0];
							}
					var i;
					for (i = 0;  i < erasers.length;  i++) {
						if (eraser == erasers[i])
							break;
							}
					var input = $(eraser).siblings('input')[i];
					$(input).val('');
					that.checkRFBInputs();
				});
			}
			
			// for (var i = 0;  i < words.length;  i++) {
			// 	words[i].addEventListener('mousedown',
			// 		function(e:any) {
			// 			if (drag_obj != null)
			// 				return;
			// 			if (this.markvisible)
			// 				$(this).unbind(e);
						
			// 			e.preventDefault();
			// 			left = 0;
			// 			top = 0;
			// 			startX = e.pageX;
			// 			startY = e.pageY;
			// 			drag_obj = this;
			// 			this.style.left = left;
		 //                this.style.top = top;
			// 		}
			// 	);
			// 	words[i].addEventListener('mousemove',
			// 		function(e:any) {
			// 			if (drag_obj != this)
			// 				return;
			// 			if (this.markvisible)
			// 				$(this).unbind(e);

			// 			e.preventDefault();
		 //                var diffX = e.pageX - startX;
		 //                var diffY = e.pageY - startY;
		 //                left = diffX;
		 //                top = diffY;
		 //                this.style.left = left + "px";
		 //                this.style.top = top + "px";
			// 		}
			// 	);
			// 	words[i].addEventListener('mouseup',
			// 		function(e:any) {
			// 			if (drag_obj != this)
			// 				return;
			// 			if (this.markvisible)
			// 				$(this).unbind(e);

			// 			this.style.visibility = 'hidden';
		 // 				var point_obj = document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop));
		 // 				this.style.visibility = 'visible';
		 // 				var target_obj = point_obj.closest('input');
		 // 				if (target_obj != null) {
		 // 					if (target_obj.tagName == "INPUT") {
		 // 						if ($(target_obj).attr("disabled") != "disabled") {
			//  						$(target_obj).val(this.innerHTML);
			//  						that.checkRFBInputs();
			// 						this.style.visibility = 'hidden';
			// 					}
			// 					//$('#html_data input').trigger('change');
		 // 					}
		 // 				}
			// 			this.style.left = 0;
		 //                this.style.top = 0;
		 //                drag_obj = null;
			// 		}
			// 	);
			// }
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
                	this.rfb_content = this.rfb_content.replace(reg, "<input type=\"text\" value=\"" + this.rfb_selected_options[index] + "\" class=\"Correct\">");	 /*disabled*/
                } else {
					this.rfb_content = this.rfb_content.replace(reg, "<input type=\"text\" value=\"" + this.rfb_selected_options[index] + "\" class=\"Wrong\">");	 /*disabled*/
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
			this.rfb_probhtml = this.rfb_probhtml.replace("<p>", "");
            this.rfb_probhtml = this.rfb_probhtml.replace("</p>", "");
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
            
            for (var i = 0;  i < selects.length;  i++) {
            	if ($(selects[i]).val() == this.currentProblem.content.selectlist[this.currentProblem.solution.optionno[i].id].options[this.currentProblem.solution.optionno[i].option]) {
            		$(selects[i]).removeClass("Wrong");
            		$(selects[i]).addClass("Correct");
            	} else {
            		$(selects[i]).removeClass("Correct");
            		$(selects[i]).addClass("Wrong");
            	}
            }

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
			this.rfb_probhtml = this.rfb_probhtml.replace("<p>", "");
            this.rfb_probhtml = this.rfb_probhtml.replace("</p>", "");
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
                	this.rfb_content = this.rfb_content.replace(reg, "<input type=\"text\" value=\"" + this.rfb_selected_options[index] + "\" style=\"color: #f00;\">");	 /*disabled*/
                } else {
					this.rfb_content = this.rfb_content.replace(reg, "<input type=\"text\" value=\"" + this.rfb_selected_options[index] + "\">");	 /*disabled*/
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
			this.rfb_probhtml = this.rfb_probhtml.replace("<p>", "");
            this.rfb_probhtml = this.rfb_probhtml.replace("</p>", "");
			htmldata_obj.innerHTML = this.rfb_probhtml;
			var spans = htmldata_obj.getElementsByTagName('span');
			for (var i = 0;  i < spans.length;  i++) {
				spans[i].addEventListener('click',
					function(e:any) {
						if ($(this).hasClass("LCD")) {
							$(this).toggleClass("Clicked");
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
			var LCD_spans = $(htmldata_obj).find("span.LCD");
			for (var i = 0;  i < LCD_spans.length;  i++) {
				$(LCD_spans).removeClass("Wrong");
				$(LCD_spans).removeClass("Correct");
			}
			
			var answer_words = [];
			var str_data = htmldata_obj.innerHTML;
			var reg = /(<span class=\"LCD[ Clicked]*\">)([a-z, ,|]*)(<\/span>)/;
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
            		solution_words.push("<span class=\"LCD\">" + arr_words[i] + "</span>");
            }
            var index = 0;
            for (var i = 0;  i < solution_words.length;  i++) {
            	var reg = /\{\{\}\}/;
            	var found = reg.test(solution_words[i]);
            	if (found) {
            		solution_words[i] = "<span class=\"LCD Clicked\">" + this.currentProblem.content.select.options[index++] + "</span>";
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
            		$(spans[i]).addClass("Wrong");
            	} else if (solution_words[i].indexOf('Clicked') >= 0){
            		$(spans[i]).addClass("Correct");
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

    onSelLecture(i: number) {
    	if ($('#quizaudio') != null) {
			if ($('#quizaudio')[0] != null) {
				if (!$('#quizaudio')[0].paused)
					return;
			}
		}

		this.sel_audio_index = -1;
		var that = this;
		var index = i;
		setTimeout(function(){
                that.sel_audio_index = index;
            },
        10);
        this.audio_visible_flag = true;
	}

	startAnswerRecording() {
		this.startExercise();
		this.audio_flag = true;
		startRecording(this.currentAnswer.testevent_id, this.currentProblem.id, window.sessionStorage.getItem('userid'), this._token );
		this.record_start_time = this.currentProblem.limit_time - this.currentlimittime;
		this.progressvalue = 0;
		this.audio_visible_flag = false;
	}

	updateOutput() {
        var lis_problem = $('#rro_list_problem ol.dd-list li.dd-item');
        this.order_left_options = [];
        for (var i = 0;  i < lis_problem.length;  i++) {
            this.order_left_options.push($(lis_problem[i]).find('div.dd-handle').html().trim());
        }

        var lis_answer = $('#rro_list_answer ol.dd-list li.dd-item');
        this.order_right_options = [];
        for (var i = 0;  i < lis_answer.length;  i++) {
            this.order_right_options.push($(lis_answer[i]).find('div.dd-handle').html().trim());
        }
    }

    nestable_flag: boolean = false;

    createRRONestable() {
        if (this.nestable_flag)
            return;
        var that = this;
        $('#rro_list_problem').nestable({
            group: 1
        }).on('change', function(e: any) {
            that.updateOutput();
        });

        // activate Nestable for list 2
        $('#rro_list_answer').nestable({
            group: 1
        }).on('change',function(e: any) {
            that.updateOutput();
        });
        $('#rro_list').nestable().on('change', function(e: any) {
            that.updateOutput();
        });
        
        this.nestable_flag = true;
    }

    onChangeAnswer() {
    	var str_sentence = $('#txtanswer').val();
    	var count = 0;
    	var reg = /[a-z,A-Z,\.]{1,1000}($|([ |\n|\,|\.]{1,1000}))/;
        var found = reg.test(str_sentence);
        while (found) {
            str_sentence = str_sentence.replace(reg, "");
            found = reg.test(str_sentence);
            count++;
        }
        $('#word_count').html(count);
    }

    downloadAnswerTxt() {
    	var url = 'data:unknown;,'+$('#txtanswer').val();
  		var hf = $('#download_answer');
  		hf.attr('href', url);
  		hf.attr('download', 'answer.txt');
  		hf.html(hf.download);
    }

    addAudioAndEvent() {
      const _self = this;
      const _id = `audio-player-${$.now()}`;
      const regex = /auto_play=(true|false)/g;
      const iframeStr = this.currentProblem.content.audio;
      const autoplayIframe = iframeStr.replace(regex, 'auto_play=true');

      $('#audiocontainer').html(autoplayIframe);
      $('#audiocontainer > iframe').attr('id', _id);

      const sdWidget = SC.Widget(_id);
      sdWidget.bind(SC.Widget.Events.PLAY, function() {
      });

      sdWidget.bind(SC.Widget.Events.FINISH, function(e: any) {
        _self.quiz_step = 2;
        _self.currentlimittime = Number(_self.currentProblem.limit_time).valueOf();
        clearInterval(_self.ctimer);
        const _self2 = _self;
        _self.ctimer = setInterval(()=> {
          _self2.currentlimittime--;
          _self2.currentAnswer.examine_uptime = _self2.currentProblem.limit_time - _self2.currentlimittime - _self2.record_start_time;
          _self2.progressvalue = Math.round(_self2.currentAnswer.examine_uptime/(_self2.currentProblem.limit_time - _self2.record_start_time)*100);

          if(_self2.currentlimittime<=0) _self2.endExercise();
        }, 1000 );

        if (_self.currentProblem.type == 'SRS' || _self.currentProblem.type == 'SSA' || _self.currentProblem.type == 'SRL') {
          _self.audio_flag = true;
          startRecording(_self.currentAnswer.testevent_id, _self.currentProblem.id, window.sessionStorage.getItem('userid'), _self._token );
          _self.record_start_time = _self.currentProblem.limit_time - _self.currentlimittime;
          _self.progressvalue = 0;
          _self.audio_visible_flag = false;
        }
      });
    }

    addSolutionAudio() {
    	$('#solutionaudiocontainer').html(this.currentProblem.solution.audio);
    }
}