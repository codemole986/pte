import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { routerTransition } from '../router.animations';
import { GlobalService } from '../shared/services/global.service';
import { Problem } from '../model/problem';
import { Answer } from '../model/answer';
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

	radio_answer_val: string;
	check_answer_val: any[];
	check_solution_val: any[];

	select_left_values: any[];
	select_right_values: any[];
	order_left_options: any[];
	order_right_options: any[];

	audio_flag: boolean;

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

	constructor(private http: Http, private route: ActivatedRoute,
  private router: Router, private globalService: GlobalService) { 
		this.quiz_id = 0;
		this.previousbutton = true;
		this.endbutton = false;
		this.nextbutton = true;
		this.answertext = false;
		this.solutiontextvisible = false;
		this.markvisible = false;
		this.currentProblem = new Problem;
		this.currentProblem.type = "WSM";	
		this.currentProblem.content = this.globalService.getContentObject(this.currentProblem.type);
		this.currentAnswer = new Answer;	
		this.currentAnswer.answer = this.globalService.getSolutionObject(this.currentProblem.type);	

		this.audio_flag = false;
	}

	

	ngOnInit() {		
		this.quiz_id = this.route.snapshot.params['id'];
		if(this.quiz_id!=null) {
			this.timerflag = true;
			this.getProblem(this.quiz_id);			
		} else {
			this.listvisible = true;
			this.getAnswers();	
		}		
	}

	getProblem(qid: number) {
		this.http.get("/problem/getproblem/"+qid).
		map(
			(response) => response.json()
		).
		subscribe(
			(data) => {
				this.currentProblem = data;
				this.currentAnswer.answer = this.globalService.getSolutionObject(this.currentProblem.type);
				this.currentAnswer.type = data.type;
				this.currentlimittime = Number(data.limit_time).valueOf();	
				this.currentAnswer.quiz_id = data.id;	

				this.editordata = this.currentAnswer;
				this.problemdata = this.currentProblem;

				if(this.currentProblem.type == 'SRS' || this.currentProblem.type == 'SSA' || this.currentProblem.type == 'LWS' || this.currentProblem.type == 'LTS' || this.currentProblem.type == 'LSA' || this.currentProblem.type == 'LSB') {
					if(this.currentProblem.content.audio!=null) {
						this.currentProblem.content.audio = "upload/q2/"+this.currentProblem.type+"/"+this.currentProblem.content.audio;
					}
				}
				if(this.currentProblem.type == 'SPI'|| this.currentProblem.type == 'RSA'  ||  this.currentProblem.type == 'RMA') {
					if(this.currentProblem.content.picture!=null){
						this.currentProblem.content.picture = "upload/q2/"+this.currentProblem.type+"/"+this.currentProblem.content.picture;
					}
				}
				if(this.currentProblem.type=='SRS' || this.currentProblem.type=='SAL' || this.currentProblem.type=='SPI' || this.currentProblem.type=='SSA') {
					if(this.currentProblem.solution.audio!=null) {
						this.currentProblem.solution.audio = "upload/s0/"+this.currentProblem.type+"/"+this.currentProblem.solution.audio;
					}
				}

				if(this.currentProblem.category=="Speaking") {
					this.audio_flag = true;
					startRecording();		
				}

				if(this.timerflag) {
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
		if ($('#html_data').html() == '') {
			this.rfb_probhtml = this.rfb_content;
			$('#html_data').html(this.rfb_probhtml);
			this.rfb_answerhtml = "<div class='row'>";
			for (var i = 0;  i < this.rfb_options.length;  i++) {
				this.rfb_answerhtml += "<div class='col-lg-2 word' style='text-align: center; border: 1px solid #ccc; background-color: #fff; padding: 10px; margin: 20px 50px; cursor: move;'>" + this.rfb_options[i] + "</div>";
			}
			this.rfb_answerhtml += "</div>";
			$('#choice_panel').html(this.rfb_answerhtml);

			var left = 0, top = 0;
			var startX = 0, startY = 0;
			var drag_obj = null;
			var target_obj = null;
			$('div.word').on('mousedown', function(e) {
				if (drag_obj != null)
					return;

				e.preventDefault();
				left = 0;
				top = 0;
				startX = e.pageX;
				startY = e.pageY;
				drag_obj = this;
			});
			$('div.word').on('mousemove', function(e) {
				if (drag_obj != this)
					return;
				e.preventDefault();
                var diffX = e.pageX - startX;
                var diffY = e.pageY - startY;
                left = diffX;
                top = diffY;
                $(this).css('left', left);
                $(this).css('top', top);
 				console.log($(e.target).closest('input'));
			});
			$('div.word').on('mouseup', function(e) {
				if (drag_obj != this)
					return;
				$(this).css('left', 0);
                $(this).css('top', 0);
                drag_obj = null;
			});
		}
	}

	createRFBSolutionView() {
		if ($('#html_answerdata').html() == '') {
			this.rfb_selected_options = [];
            var str_data = $('#html_data').html();
            var inputs = $('#html_data').find('input');
            for (var i = 0;  i < inputs.length;  i++) {
            	this.rfb_selected_options.push($(inputs[i]).val());
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
            $('#html_data').html(this.rfb_content);

			this.rfb_solutionhtml = this.currentProblem.content.text;
			var reg = /\{\{\}\}/;
            var index = 0;
            var found = reg.test(this.rfb_solutionhtml);
            while (found) {
                var matches = reg.exec(this.rfb_solutionhtml);
                this.rfb_solutionhtml = this.rfb_solutionhtml.replace(reg, "<input type=\"text\" value=\"" + this.currentProblem.content.select.options[this.currentProblem.solution.optionno[index++]] + "\" disabled>");
                found = reg.test(this.rfb_solutionhtml);
            }
            $('#html_answerdata').html(this.rfb_solutionhtml);
		}
	}

	createRANView() {
		if ($('#html_data').html() == '') {
			this.rfb_probhtml = this.rfb_content;
			$('#html_data').html(this.rfb_probhtml);
		}
	}

	createRANSolutionView() {
		if ($('#html_answerdata').html() == '') {
			this.rfb_selected_options = [];
            var str_data = $('#html_data').html();
            var selects = $('#html_data').find('select');
            for (var i = 0;  i < selects.length;  i++) {
            	this.rfb_selected_options.push($(selects[i]).val());
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
            $('#html_data').html(this.rfb_content);

			this.rfb_solutionhtml = this.currentProblem.content.text;
			var reg = /\{\{\}\}/;
            var index = 0;
            var found = reg.test(this.rfb_solutionhtml);
            while (found) {
                var matches = reg.exec(this.rfb_solutionhtml);
                this.rfb_solutionhtml = this.rfb_solutionhtml.replace(reg, "<input type=\"text\" value=\"" + this.currentProblem.content.selectlist[this.currentProblem.solution.optionno[index].id].options[this.currentProblem.solution.optionno[index++].option] + "\" disabled>");
                found = reg.test(this.rfb_solutionhtml);
            }
            $('#html_answerdata').html(this.rfb_solutionhtml);
		}
	}

	createLTWView() {
		if ($('#html_data').html() == '') {
			this.rfb_probhtml = this.rfb_content;
			$('#html_data').html(this.rfb_probhtml);
		}
	}

	createLTWSolutionView() {
		if ($('#html_answerdata').html() == '') {
			this.rfb_selected_options = [];
            var str_data = $('#html_data').html();
            var inputs = $('#html_data').find('input');
            for (var i = 0;  i < inputs.length;  i++) {
            	this.rfb_selected_options.push($(inputs[i]).val());
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
            $('#html_data').html(this.rfb_content);

			this.rfb_solutionhtml = this.currentProblem.content.text;
			var reg = /\{\{\}\}/;
            var index = 0;
            var found = reg.test(this.rfb_solutionhtml);
            while (found) {
                var matches = reg.exec(this.rfb_solutionhtml);
                this.rfb_solutionhtml = this.rfb_solutionhtml.replace(reg, "<input type=\"text\" value=\"" + this.currentProblem.content.select.options[index++] + "\" disabled>");
                found = reg.test(this.rfb_solutionhtml);
            }
            $('#html_answerdata').html(this.rfb_solutionhtml);
		}
	}

	createLCDView() {
		if ($('#html_data').html() == '') {
			this.rfb_probhtml = this.rfb_content;
			$('#html_data').html(this.rfb_probhtml);

			$('#html_data span').on('click',(function(){
				if ($(this).hasClass('LCD'))
					$(this).toggleClass('Clicked');
			}));
		}
	}

	createLCDSolutionView() {
		if ($('#html_answerdata').html() == '') {
			$('#html_data span.LCD').removeClass('LCD');
			var spans = $('#html_data span');
			for (var i = 0;  i < spans.length;  i++) {
				if ($(spans[i]).attr('class') == '')
					$(spans[i]).removeAttr('class');
			}

			var answer_words = [];
			var str_data = $('#html_data').html();
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
            $('#html_data').html(this.rfb_content);

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
            $('#html_answerdata').html(this.rfb_solutionhtml);

            for (var i = 0;  i < solution_words.length;  i++) {
            	if (answer_words[i] != solution_words[i]) {
            		$($('#html_data').find('span')[i]).addClass('Wrong');
            	} else if (solution_words[i].indexOf('Clicked') >= 0){
            		$($('#html_data').find('span')[i]).addClass('Correct');
            	}
            }
		}
	}

	dragWord() {	
		alert('aaaa');
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


	endExamine() {
		clearInterval(this.ctimer);
		this.endbutton = true;
		this.nextbutton = false;
		if(this.quiz_id > 1)
			this.previousbutton = false;		
		this.answertext = true;	
		//this.solutiontextvisible = true;
		this.evaluateExamine();
		this.markvisible = true;
		
		if(this.audio_flag) {
			stopRecording();
			this.audio_flag = false;
		}
		//this.onSave();	
	}

	evaluateExamine() {
		//alert("50");
		this.currentAnswer.evaluate_mark = 50;
	}

	onSave() {
		this.http.post("/answer/insert", this.currentAnswer).
    	map(
            (response) => response.json()
        ).
        subscribe(
    		(data) => {
    			alert(data.message);
    		}
    	);
    }

    onClickDelete(id: number) {
    	if(confirm("Delete really?")) {
	    	this.http.get("/answer/delete/"+id).
	    	map(
	            (response) => response.json()
	        ).
	        subscribe(
	    		(data) => {
	    			alert(data.message);
	    			this.getAnswers();
	    		}
	    	);
	    }
    }


    prevExamine() {
    	if(this.quiz_id>1)
			this.quiz_id--;

		this.previousbutton = true;
		this.endbutton = false;
		this.nextbutton = true;
		this.answertext = false;
		this.solutiontextvisible = false;
		this.markvisible = false;
		this.getProblem(this.quiz_id);			
	}

	nextExamine() {
		this.quiz_id++;
		this.previousbutton = true;
		this.endbutton = false;
		this.nextbutton = true;
		this.answertext = false;
		this.solutiontextvisible = false;
		this.markvisible = false;
		this.getProblem(this.quiz_id);			
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
