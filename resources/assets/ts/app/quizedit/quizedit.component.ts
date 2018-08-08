import { Component, OnInit, Directive, OnDestroy, OnChanges } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { TranslateService } from '@ngx-translate/core';
import { every, isObject, last, map, remove } from 'lodash';
import { v4 as uuid } from 'uuid';
import { NestableSettings } from 'ngx-nestable/src/nestable.models';
import 'rxjs/add/operator/map';

import { routerTransition } from '../router.animations';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { GlobalService } from '../shared/services/global.service';
import { Problem } from '../model/problem';
import { TypeRenderComponent } from '../test/type-render.component';
import { FileUploadDirective } from '../dashboard/file-upload.directive';

declare var $:any;
declare var angular:any;
declare var Dropzone: any;
declare var CKEDITOR: any;
declare var bootbox: any;
declare var Metronic: any;
declare var Datatable: any;
declare var window: any;
declare function jQuery(): any;

@Component({
	selector: 'app-quizedit',
	template: require('./quizedit.component.html'),
	styles: [`${require('./quizedit.component.css')}`],
	animations: [routerTransition()],
	providers: [GlobalService]
})
export class QuizeditComponent implements OnInit, OnDestroy {
	pdegree = [
		{ value:"", title:"* Degree" },
        { value:"Easy", title:"Easy" },
        { value:"Medium", title:"Medium" },
        { value:"Hard", title:"Hard" }
        ];
    degree = ['Easy', 'Medium', 'Hard'];
    actionflag : boolean = window.sessionStorage.getItem('permission')=='A' || window.sessionStorage.getItem('permission')=='B';

	newproblem:boolean;
	editproblem:boolean;
	editedProblem: Problem;

	strOptionSentence: string;
    strAudioURL: string;

	categoryNames: any[];
	types: any[];

	arr_types: any[];
	
    select_problem_values: any[];
    select_titles: any[];
	select_solution_value: string;
    select_solution_values: any[];

    show_editoption: boolean;
    dis_editoption: boolean;
    show_chngoption: boolean;
    dis_deleteoption: boolean;

    _CKEDITOR: any; 
    str_blank: string;

    savefalg: boolean = true;

    select_blank_values: string[];
    select_blank_options: string[];
    blank_selectlist: any[];
    solution_selectlist: any;

    @ViewChild('audioproblemFile') audioproblemfile: ElementRef;
    @ViewChild('audiosolutionFile') audiosolutionfile: ElementRef;
    @ViewChild('pictureproblemFile') pictureproblemfile: ElementRef;
    @ViewChild('lectureproblemFile') lectureproblemfile: ElementRef;
    @ViewChild('optionsentence') optionsentence: ElementRef;

    @ViewChild('grdTags') grdObj: any;

    quizgridsettings: any;
    quizdatasource: ServerDataSource;
    curselectedrowid: number;

    editproblem_oldtype: string;
    thisDropzone: any;
    solutionDropzone: any;
    _stoken: string;
    active_menu: string = "overview";

    lastClickTime: number = 0;

    type_name: string = '';

    uploadedFiles: {
        path: string,
        uuid: string
    }[];

    ngxNestableOptions = {
        fixedDepth: true
    } as NestableSettings;

    nestedList: { value: string }[] = [];
    
    constructor(private http: Http, private route: ActivatedRoute, private router: Router, private globalService: GlobalService, private translate: TranslateService) { 
        Dropzone.autoDiscover = false;
        this._CKEDITOR = CKEDITOR;
        if(this._stoken==null) {
            this._stoken = window.sessionStorage.getItem("_token");
        }

        this.type_name = "";

        const _self = this;
        this.router.events.subscribe((val: any) => {
            if (val instanceof ActivationEnd) {
            	
            	if(val.snapshot.routeConfig.path.indexOf("quizedit") < 0) 
            		return;

                _self.newproblem = (val.snapshot.params['add'] != null ? true : false);
                _self.editproblem = (val.snapshot.params['edit'] != null ? true : false);
                if (_self.newproblem) {
                    _self.editedProblem = new Problem;
                    _self.editedProblem.category = val.snapshot.params['category'];
                    _self.editedProblem.type = val.snapshot.params['type'];
                    _self.onSelectProbCategory(_self.editedProblem.category, _self.editedProblem.type);
                    _self.initialize();
                } else if (_self.editproblem) {
                    _self.initialize();
                    _self.editedProblem = new Problem;
                    _self.http.get("/problem/getproblem/"+val.snapshot.params['id']).
                    map(
                        (response) => response.json()
                    ).
                    subscribe(
                        (data) => {
                            _self.editedProblem = data;
                            _self.uploadedFiles = [{
                                path: data.content.picture,
                                uuid: uuid()
                            }];

                            _self.showEditProblemForm();

                            if (_self.editedProblem.type == 'RRO') {
                                _self.updateNestedList();
                            }
                        }
                    );
                }
            }
        });
    }

    ngOnDestroy() {
    }

	ngOnInit() {
        switch(window.sessionStorage.getItem('permission')) {
            case 'A' : this.active_menu = "manage"; break;
            case 'B' : this.active_menu = "teacher"; break;
            case 'D' : this.active_menu = "student"; break;
            default : this.active_menu = "overview";
        }

        this.uploadedFiles = [];

        this.categoryNames = this.globalService.problemCategoryNames;
    }

    initialize() {
        this.curselectedrowid = -1;

        if (this.newproblem) {
            if (this.editedProblem.type != '') {
                this.type_name = this.globalService.getTypeName(this.editedProblem.type);
            }
        }

        if (this.thisDropzone) {
            this.thisDropzone.destroy();
        }

        if (this.solutionDropzone) {
            this.solutionDropzone.destroy();
        }

        this.wizard_flag = false;
        Metronic.init();

	}
	

    testpreparationtimevalue(max: number){
        if(this.editedProblem.preparation_time > max) {
            this.editedProblem.preparation_time = max;
        }
    }

    testlimittimevalue(max: number){
        if(this.editedProblem.limit_time > max) {
            this.editedProblem.limit_time = max;
        }
    }

    testpointsvalue(max: number){
        if(this.editedProblem.points > max) {
            this.editedProblem.points = max;
        }
    }

    showEditProblemForm() {        
		this.newproblem = false;
		this.editproblem = true;
        
        if (this.editedProblem.type == 'RSA'  ||  this.editedProblem.type == 'LSB') {
            this.select_solution_value = this.editedProblem.content.select.options[this.editedProblem.solution.optionno];
        } else if (this.editedProblem.type == 'RMA'  ||  this.editedProblem.type == 'LSA') {
            this.select_solution_values = [];
			for (var i = 0;  i < this.editedProblem.solution.optionno.length;  i++) {
				this.select_solution_values.push(this.editedProblem.content.select.options[ this.editedProblem.solution.optionno[i] ]);
			}
		}

        if(this.editedProblem.type == 'RSA'  ||  this.editedProblem.type == 'RMA' || this.editedProblem.type =='SPI') {
            if (this.thisDropzone) {
                this.thisDropzone.destroy();
            }
            Dropzone.autoDiscover = false;
            this.create_dropzone('picture');
        }

		this.show_editoption = true;
        this.dis_editoption = true;
        this.show_chngoption = false;
        this.dis_deleteoption = true;
        this.strOptionSentence = "";
        this.strAudioURL = "";
        this.str_blank = "";
        this.select_problem_values = [];
        this.select_titles = [];

        this.ck_flag = false;
        this.wizard_flag = false;

        var that = this;
        setTimeout(function(){
                if (that.optionsentence != null) {
                    that.optionsentence.nativeElement.addEventListener('keydown', function(e: any) {
                        if (e.keyCode == 13) {
                            if (that.show_chngoption) {
                                if (that.editedProblem.type == 'SRL') {
                                    that.onChangeTitleOption();
                                } else {
                                    that.onChangeOption();
                                }
                            } else {
                                if (that.editedProblem.type == 'SRL') {
                                    that.onAddTitleOption();
                                } else {
                                    that.onAddOption();
                                }
                            }
                        }
                    });
                }

                if ($('#select_options') != null) {
                    $('#select_options').on('keydown', function(e: any) {
                        if (e.keyCode == 46) {
                            if (!that.show_chngoption) {
                                if (that.editedProblem.type == 'SRL') {
                                    that.onDeleteTitleOption();
                                } else {
                                    that.onDeleteOption();
                                }
                            }
                        }
                    });
                }
            },
        10);
	}

	showAddProblemForm() {
        var old_category = null;
        if (this.editedProblem != null)
            old_category = this.editedProblem.category;
        this.editedProblem = new Problem;
        if (old_category == null  ||  this.editproblem_oldtype == null) {
            this.editedProblem.category = 'Writing';
            this.types = this.getTypes('Writing');
            this.editedProblem.type = this.types[0].value;
        } else {
            this.editedProblem.category = old_category;
            this.editedProblem.type = this.editproblem_oldtype;
        }
        this.editproblem_oldtype = null;
        this.onSelectProbCategory(this.editedProblem.category, this.editedProblem.type);
	}

    ck_flag: boolean = false;
    
    createCkEditor() {
        if (!this.ck_flag) {
            if (this._CKEDITOR.instances instanceof Array) {
                for (var inst in this._CKEDITOR.instances)
                    this._CKEDITOR.instances[inst].destroy(true);
            }
            this._CKEDITOR.removeAllListeners();
            if (typeof this._CKEDITOR.destroy === "function") 
                this._CKEDITOR.destroy();

            if (typeof this._CKEDITOR.instances.ck_editor !=="undefined") {
                try {
                    this._CKEDITOR.instances.ck_editor.destroy(true);
                } catch(e) { };
            }
            var that = this;
            setTimeout(function(){
                    that._CKEDITOR.replace( 'ck_editor' );
                    
                    that.convertContentToCkData();
                },
            10);
            
            this.ck_flag = true;
        }
    }

    initProblem() {
        this.editedProblem.degree = "";
        this.editedProblem.content = [];
        this.editedProblem.solution = [];
        this.editedProblem.content = this.globalService.getContentObject(this.editedProblem.type);
        this.editedProblem.solution = this.globalService.getSolutionObject(this.editedProblem.type);
        this.newproblem = true;
        this.editproblem = false;
        this.show_editoption = true;
        this.dis_editoption = true;
        this.show_chngoption = false;
        this.dis_deleteoption = true;
        this.strOptionSentence = "";
        this.strAudioURL = "";
        this.select_problem_values = [];
        this.select_titles = [];
        this.select_blank_values = [];
        this.select_blank_options = [];
        this.blank_selectlist = [];
        this.str_blank = "";
        
        this.ck_flag = false;
        
        var that = this;
        setTimeout(function(){
                if (that.optionsentence != null) {
                    that.optionsentence.nativeElement.addEventListener('keydown', function(e: any) {
                        if (e.keyCode == 13) {
                            if (that.show_chngoption) {
                                if (that.editedProblem.type == 'SRL') {
                                    that.onChangeTitleOption();
                                } else {
                                    that.onChangeOption();
                                }
                            } else {
                                if (that.editedProblem.type == 'SRL') {
                                    that.onAddTitleOption();
                                } else if (that.editedProblem.type != 'RRO') {
                                    that.onAddOption();
                                }
                            }
                        }
                    });
                }

                if ($('#select_options') != null) {
                    $('#select_options').on('keydown', function(e: any) {
                        if (e.keyCode == 46) {
                            if (!that.show_chngoption) {
                                if (that.editedProblem.type == 'SRL') {
                                    that.onDeleteTitleOption();
                                } else {
                                    that.onDeleteOption();
                                }
                            }
                        }
                    });
                }
            },
        10);
    }

    audioplay(sqtype: string) {
    	var audio_obj_name = "#"+sqtype+"audio";
    	var btn_obj_name = "#btn"+sqtype+"audio";

    	var audio = $(audio_obj_name)[0];
    	if (audio.paused) {
    		audio.play();
    		$("#btnquizaudio").html('<i class="fa fa-pause fa-fw"></i>');
    	}
		else {
			audio.pause();
			$("#btnquizaudio").html('<i class="fa fa-play fa-fw"></i>');
		}
    }

    onClickSave() {
        if(this.editedProblem.title == null || this.editedProblem.title.length == 0 || this.editedProblem.title.length > 255 ) {
            this.savefalg = false;            
            return;
        }

        if(isNaN(this.editedProblem.preparation_time) || this.editedProblem.preparation_time < 0  ) {
            this.savefalg = false;
            return;
        }

        if(isNaN(this.editedProblem.limit_time) || this.editedProblem.limit_time < 0  ) {
            this.savefalg = false;
            return;
        }

        if(isNaN(this.editedProblem.points) || this.editedProblem.points < 0  ) {
            this.savefalg = false;
            return;
        }

        switch (this.editedProblem.type) {
            case 'WSM':
                this.checkCkEditorInfo();
                break;
            case 'RFB':
            case 'LTW': {
                break;
            }
            case 'LCD':
                this.checkCkEditorInfo();
                break;
            case 'RSA' :                
            case 'RMA' :
            case 'SPI' :
                if(this.uploadedFiles.length > 0) {
                    const lastFile = last(this.uploadedFiles);
                    this.editedProblem.content.picture = lastFile.path;
                }
                break;
        }

        this.savefalg = true;
        var that = this;
        this.http.post("/problem/insert", this.editedProblem).
    	map(
            (response) => response.json()
        ).
        subscribe(
    		(data) => {
                if(data.state == "success") {
                    that.editedProblem.id = data.qid; 
                    if(that.thisDropzone && that.thisDropzone.files.length>0) {
                        that.thisDropzone.options.params.quizid = data.qid;
                        that.thisDropzone.uploadFiles(that.thisDropzone.files);
                    };

                    that.onClickList();                         
                } else {
                    Metronic.showErrMsg(data.message);
                }
    		}
    	);
    }

    onClickExercise() {
        if(this.curselectedrowid != -1) {
            if(this.editedProblem.id!=null) {            
                this.router.navigate(['/exercise', this.editedProblem.id]);
            }
        } else {
            this.translate.stream("Select problem.").subscribe((res: any) => {
                Metronic.showWarnMsg(res);
            });
        }
    }

    onClickPreview() {
        if(this.curselectedrowid != -1) {
            if(this.editedProblem.id!=null) {            
                this.router.navigate(['/quiz', this.editedProblem.id]);
            }
        } else {
            this.translate.stream("Select problem.").subscribe((res: any) => {
                Metronic.showWarnMsg(res);
            });
        }
    }

    onClickList() {
        this.newproblem = false;
        this.editproblem = false;
        this.savefalg = true;
        this.curselectedrowid = -1;
        this.router.navigate(['/quizlist']);
    }

    onClickUpdate() {
    	if(this.editedProblem.title == null || this.editedProblem.title.length == 0 || this.editedProblem.title.length > 255 ) {
            this.savefalg = false;            
            return;
        }

        if(this.editedProblem.degree == ""  ) {
            this.savefalg = false;
            return;
        }

        if(isNaN(this.editedProblem.preparation_time) || this.editedProblem.preparation_time < 0  ) {
            this.savefalg = false;
            return;
        }

        if(isNaN(this.editedProblem.limit_time) || this.editedProblem.limit_time < 0  ) {
            this.savefalg = false;
            return;
        }

        if(isNaN(this.editedProblem.points) || this.editedProblem.points < 0  ) {
            this.savefalg = false;
            return;
        }

        switch (this.editedProblem.type) {
            case 'WSM':
                this.checkCkEditorInfo();
                break;
            case 'LCD':
                this.checkCkEditorInfo();
                break;
            case 'RSA' :                
            case 'RMA' :
            case 'SPI' :
                if(this.uploadedFiles.length > 0) {
                    const lastFile = last(this.uploadedFiles);
                    this.editedProblem.content.picture = lastFile.path;
                }
                break;
        }

        var that = this;
    	this.http.post("/problem/update", this.editedProblem).
    	map(
            (response) => response.json()
        ).
        subscribe(
    		(data) => {
                if( data.state == "error") {
                    Metronic.showErrMsg(data.message);
                } else {
                    that.onClickList();
                }
    		}
    	);
    }

    getTypes(category: string) {
    	return this.globalService.problemTypes[category];
    }

    getTypeName(category: string, value: string) {
    	this.arr_types = this.getTypes(category);
        for (var i = 0;  i < this.arr_types.length; i++) {
            if (this.arr_types[i].value == value)
                return this.arr_types[i].title;
        }
    	return '';
    }

    onChangeProbCategory() {
    	this.types = this.getTypes(this.editedProblem.category);
    	this.editedProblem.type = this.types[0].value;
        this.initProblem();
    }

    onChangeProbType() {
        this.initProblem();
    }

    create_dropzone(ftype: string) {
        var objdz_name = '#dz'+ftype+'file'; 
        var that = this;       
        setTimeout(() => {
            if (that.editedProblem.type=='SRL') {
                if(ftype=='audio') {
                } else {
                    try {
                        that.thisDropzone = new Dropzone(objdz_name, {
                            url: '/problem/uploadfile',
                            addRemoveLinks: true,
                            uploadMultiple: true,
                            autoQueue: false,
                            maxFilesize: 5,         
                            acceptedFiles: "image/jpeg, images/jpg, image/png",           
                            params: {type:'quiz', quizid:'', _token: that._stoken}
                        });
                    } catch(e) {
                        
                    }
                }                
            } else {
                if(ftype=='audio') {
                } else {
                    try {
                        that.thisDropzone = new Dropzone(objdz_name, {
                            url: '/problem/uploadfile',
                            addRemoveLinks: true,
                            uploadMultiple: false,
                            autoQueue: false,
                            maxFilesize: 5,  
                            maxFiles: 1,       
                            acceptedFiles: "image/jpeg, images/jpg, image/png",           
                            params: {type:'quiz', quizid:'', _token: that._stoken}
                        });
                    } catch(e) {
                        
                    }
                } 
            }            
            
        }, 500);
    }

    onSelectProbCategory(category: string, type: string) {
        this.editedProblem.category = category
        this.editedProblem.type = type;
        this.initProblem();

        if(this.editedProblem.type == "LSB" || this.editedProblem.type =='SRS' || this.editedProblem.type =='SSA' || this.editedProblem.type =='SRL' || this.editedProblem.type =='LWS' || this.editedProblem.type =='LSA' || this.editedProblem.type =='LTW' || this.editedProblem.type =='LCD' || this.editedProblem.type =='LTS') {
            if (this.thisDropzone) {
                this.thisDropzone.destroy();
            }
            Dropzone.autoDiscover = false;
            this.create_dropzone('audio');
            
        } else if(this.editedProblem.type == 'RSA'  ||  this.editedProblem.type =='RMA' || this.editedProblem.type =='SPI') {
            if (this.thisDropzone) {
                this.thisDropzone.destroy();
            }
            Dropzone.autoDiscover = false;
            this.create_dropzone('picture');
        }

        if(this.editedProblem.type == 'SAL' || this.editedProblem.type == 'SRS' || this.editedProblem.type == 'SPI' || this.editedProblem.type == 'SSA' || this.editedProblem.type == 'SRL') {
            if (this.solutionDropzone) {
                this.solutionDropzone.destroy();
            }
            Dropzone.autoDiscover = false;
        }
    }

    getCategoryIconClass(category: string) {
        if (category == 'Writing')  return "fa-keyboard-o";
        else if (category == 'Listening') return "fa-headphones";
        else if (category == 'Reading') return "fa-eye";
        else if (category == 'Speaking') return "fa-volume-up";
        return "";
    }
/* =============================== WSM ======================================*/

/* =============================== RSA ======================================*/
    // problem
    validateOption() {
        if (this.strOptionSentence == "")
    		return false;

        if (this.globalService.getIndexFromArray(this.editedProblem.content.select.options, this.strOptionSentence) >= 0)
    		return false;
    	
        return true;
    }
    validateTitleOption() {
        if (this.strOptionSentence == ""  ||  this.strAudioURL == "")
            return false;

        return true;
    }
    onChangeProbSelect() {
        this.show_editoption = true;
    	this.show_chngoption = false;
        var selCount = this.select_problem_values.length;
        if (selCount == 1) {
    		this.dis_editoption = false;
    	} else {
    		this.dis_editoption = true;
    	}
    	if (selCount == 0) {
    		this.dis_deleteoption = true;
    	} else {
    		this.dis_deleteoption = false;
    	}
    }
    onChangeProbSelect1(index: number) {
        
        
    }
    onAddOption() {
    	if (this.validateOption() == false) {
    		return;
    	}
        for (var i = 0;  i < this.editedProblem.content.select.options.length;  i++) {
            if (this.editedProblem.content.select.options[i] == "")
                this.editedProblem.content.select.options.splice(i, 1);
        }
    	this.editedProblem.content.select.options.push(this.strOptionSentence);
        if (this.editedProblem.type == 'RRO') {
            this.updateNestedList();
        }
        this.optionsentence.nativeElement.value='';
        this.optionsentence.nativeElement.focus();
    }
    onEditOption() {
        var i = this.globalService.getIndexFromArray(this.editedProblem.content.select.options, this.select_problem_values[0]);
        if (i >= 0) this.strOptionSentence = this.editedProblem.content.select.options[i];
        this.optionsentence.nativeElement.focus();
    	this.show_editoption = false;
    	this.show_chngoption = true;
        this.dis_deleteoption = true;
    }
    onChangeOption() {
    	if (this.validateOption() == false) {
    		return;
    	}
        var i = this.globalService.getIndexFromArray(this.editedProblem.content.select.options, this.select_problem_values[0]);
        if (i >= 0) {
            this.editedProblem.content.select.options.splice(i, 1, this.strOptionSentence);
            if (this.editedProblem.type == 'RRO') {
                this.updateNestedList();
            }
        }
        
        this.show_editoption = true;
    	this.show_chngoption = false;
    	this.dis_editoption = true;
    	this.dis_deleteoption = true;
    }
    onDeleteOption() {
    	for (var i = 0;  i < this.select_problem_values.length;  i++) {
            var j = this.globalService.getIndexFromArray(this.editedProblem.content.select.options, this.select_problem_values[i]);
    		if (j >= 0)
    			this.editedProblem.content.select.options.splice(j, 1);
    	}
        for (var i = 0;  i < this.editedProblem.content.select.options.length;  i++) {
            if (this.editedProblem.content.select.options[i] == "")
                this.editedProblem.content.select.options.splice(i, 1);
        }
        this.dis_editoption = true;
    	this.dis_deleteoption = true;

        if (this.editedProblem.type == 'RRO') {
            this.updateNestedList();
        }
    }
    onUpOption() {
        var selCount = this.select_problem_values.length;
        if (selCount != 1)
            return;

        var sel_val = this.select_problem_values[0];
        var options = this.editedProblem.content.select.options;
        var i = this.globalService.getIndexFromArray(options, sel_val);
        if (i > 0) {
            var tmp = options[i];
            options[i] = options[i - 1];
            options[i - 1] = tmp;
        }
    }
    onDownOption() {
        var selCount = this.select_problem_values.length;
        if (selCount != 1)
            return;

        var sel_val = this.select_problem_values[0];
        var options = this.editedProblem.content.select.options;
        var i = this.globalService.getIndexFromArray(options, sel_val);
        if (i < options.length - 1) {
            var tmp = options[i];
            options[i] = options[i + 1];
            options[i + 1] = tmp;
        }
    }

    onChangeTitleSelect() {
        this.show_editoption = true;
        this.show_chngoption = false;
        var selCount = this.select_titles.length;
        if (selCount == 1) {
            this.dis_editoption = false;
        } else {
            this.dis_editoption = true;
        }
        if (selCount == 0) {
            this.dis_deleteoption = true;
        } else {
            this.dis_deleteoption = false;
        }
    }
    onAddTitleOption() {
        if (this.validateTitleOption() == false) {
            return;
        }
        for (var i = 0;  i < this.editedProblem.content.list.length;  i++) {
            if (this.editedProblem.content.list[i] == "")
                this.editedProblem.content.list.splice(i, 1);
        }
        this.editedProblem.content.list.push({ "audio": this.strAudioURL, "title": this.strOptionSentence });
        this.optionsentence.nativeElement.value='';
        this.optionsentence.nativeElement.focus();
        $('#quizaudiofile').val('');
    }
    onEditTitleOption() {
        var i = this.globalService.getDataFromArray(this.editedProblem.content.list, this.select_titles[0], "title");
        if (i >= 0) {
            this.strOptionSentence = this.editedProblem.content.list[i].title;
            this.strAudioURL = this.editedProblem.content.list[i].audio;
        }
        this.optionsentence.nativeElement.focus();
        this.show_editoption = false;
        this.show_chngoption = true;
        this.dis_deleteoption = true;
    }
    onChangeTitleOption() {
        if (this.validateTitleOption() == false) {
            return;
        }
        var i = this.globalService.getDataFromArray(this.editedProblem.content.list, this.select_titles[0], "title");
        if (i >= 0) {
            this.editedProblem.content.list[i].title = this.strOptionSentence;
            this.editedProblem.content.list[i].audio = this.strAudioURL;
        }
        
        this.show_editoption = true;
        this.show_chngoption = false;
        this.dis_editoption = true;
        this.dis_deleteoption = true;
    }
    onDeleteTitleOption() {
        for (var i = 0;  i < this.editedProblem.content.list.length;  i++) {
            if (this.editedProblem.content.list[i] == "")
                this.editedProblem.content.list.splice(i, 1);
        }
        for (var i = 0;  i < this.select_titles.length;  i++) {
            var j = this.globalService.getDataFromArray(this.editedProblem.content.list, this.select_titles[i], "title");
            if (j >= 0)
                this.editedProblem.content.list.splice(j, 1);
        }
        this.dis_editoption = true;
        this.dis_deleteoption = true;
    }
    onUpTitleOption() {
        var selCount = this.select_titles.length;
        if (selCount != 1)
            return;

        var sel_val = this.select_titles[0];
        var options = this.editedProblem.content.list;
        var i = this.globalService.getDataFromArray(options, sel_val, "title");
        if (i > 0) {
            var tmp = options[i].title;
            options[i].title = options[i - 1].title;
            options[i - 1].title = tmp;
            tmp = options[i].audio;
            options[i].audio = options[i - 1].audio;
            options[i - 1].audio = tmp;
        }
    }
    onDownTitleOption() {
        var selCount = this.select_titles.length;
        if (selCount != 1)
            return;

        var sel_val = this.select_titles[0];
        var options = this.editedProblem.content.list;
        if (every(options, isObject)) {
            var i = this.globalService.getDataFromArray(options, sel_val, "title");
            if (i < options.length - 1) {
                var tmp = options[i].title;
                options[i].title = options[i + 1].title;
                options[i + 1].title = tmp;
                tmp = options[i].audio;
                options[i].audio = options[i + 1].audio;
                options[i + 1].audio = tmp;
            }
        }
    }

    // solution
    onChangeSolutionSelect() {
        var i = this.globalService.getIndexFromArray(this.editedProblem.content.select.options, this.select_solution_value);
        if (i >= 0)
            this.editedProblem.solution.optionno = i;
    }

/* ================================= RMA =============================== */
    // solution
	onChangeSolutionMultipleSelect() {
		this.editedProblem.solution.optionno = [];
        for (var i = 0;  i < this.select_solution_values.length;  i++) {
            var j = this.globalService.getIndexFromArray(this.editedProblem.content.select.options, this.select_solution_values[i]);
			if (j >= 0)
    			this.editedProblem.solution.optionno.push(j);
		}
    }
/* ================================= LCD ============================== */
    onBlankClick() {
        if (!this.str_blank) return;

        if (this.editedProblem.type == 'LCD') {
            if (this._CKEDITOR.instances.ck_editor) {
                this._CKEDITOR.instances.ck_editor.insertHtml( "<span style='background-color:#ff0'>" + this.str_blank + "</span>&nbsp;" );
            }
        } else {
            if (this._CKEDITOR.instances.ck_editor) {
                this._CKEDITOR.instances.ck_editor.insertHtml( "<input type='text' value='" + this.str_blank + "'>" );
            }
        }
        this.str_blank = '';
    }

    repairCkData() {
        var str_data = this._CKEDITOR.instances.ck_editor.getData();
        if (str_data.indexOf("<p>") < 0  &&  str_data.indexOf("</p>") < 0) {
            str_data = "<p>" + str_data + "</p>";
        }
        str_data = str_data.replace("&nbsp;", " ");
        str_data = str_data.replace("&#8203;", "");
        this._CKEDITOR.instances.ck_editor.setData(str_data);
    }

    convertCkDataToContent() {
        switch (this.editedProblem.type) {
            case 'WSM':
                var str_data = this._CKEDITOR.instances.ck_editor.getData();
                str_data = str_data.replace("&nbsp;", " ");
                str_data = str_data.replace("&#8203;", "");
                this.editedProblem.content.text = str_data;
                break;
            case 'LCD':
                this.editedProblem.content.select.options = [];
                var str_data = this._CKEDITOR.instances.ck_editor.getData();
                str_data = str_data.replace("<p>", "");
                str_data = str_data.replace("</p>", "");
                var reg = /(<span style=\"background-color:\#ff0\">)([a-z, ,|]*)(<\/span>)/;
                var found = reg.test(str_data);
                var chngflag = false;
                while (found) {
                    var matches = reg.exec(str_data);
                    var blank = matches[2];
                    str_data = str_data.replace(reg, "{{}}");
                    this.editedProblem.content.select.options.push(blank);
                    found = reg.test(str_data);
                    chngflag = true;
                }
                if (chngflag == false) {
                    reg = /(<span style=\"background-color:rgb\(255, 255, 0\)\">)([a-z, ,|]*)(<\/span>)/;
                    found = reg.test(str_data);
                    while (found) {
                        var matches = reg.exec(str_data);
                        var blank = matches[2];
                        str_data = str_data.replace(reg, "{{}}");
                        this.editedProblem.content.select.options.push(blank);
                        found = reg.test(str_data);
                    }
                }
                this.editedProblem.content.text = str_data;
                break;
        }
    }
    convertContentToCkData() {
        var content = this.editedProblem.content.text;
        switch (this.editedProblem.type) {
            case 'LCD':
                var reg = /\{\{\}\}/;
                var index = 0;
                var found = reg.test(content);
                while (found) {
                    var matches = reg.exec(content);
                    var text = this.editedProblem.content.select.options[index++];
                    content = content.replace(reg, "<span style='background-color:#ff0'>" + text + "</span>");
                    found = reg.test(content);
                }
                this._CKEDITOR.instances.ck_editor.setData(content);
                break;
        }
    }

    checkCkEditorInfo() {
        this.convertCkDataToContent();
        this.convertContentToCkData();
    }
/* ========================== RAN ========================== */
    onChangeBlankSelect() {
        this.show_editoption = true;
        this.show_chngoption = false;
        var selCount = this.select_blank_values.length;
        if (selCount == 1) {
            this.dis_editoption = false;
        } else {
            this.dis_editoption = true;
        }
        if (selCount == 0) {
            this.dis_deleteoption = true;
        } else {
            this.dis_deleteoption = false;
        }
    }
    validateBlank() {
        if (this.strOptionSentence == "")
            return false;

        if (this.globalService.getIndexFromArray(this.select_blank_options, this.strOptionSentence) >= 0)
            return false;
        
        return true;
    }
    onAddBlank() {
        if (this.validateBlank() == false) {
            return;
        }
        this.select_blank_options.push(this.strOptionSentence);
        this.optionsentence.nativeElement.value='';
        this.optionsentence.nativeElement.focus();
    }
    onEditBlank() {
        var i = this.globalService.getIndexFromArray(this.select_blank_options, this.select_blank_values[0]);
        if (i >= 0) this.strOptionSentence = this.select_blank_options[i];
        this.optionsentence.nativeElement.focus();
        this.show_editoption = false;
        this.show_chngoption = true;
        this.dis_deleteoption = true;
    }
    onChangeBlank() {
        if (this.validateBlank() == false) {
            return;
        }
        var i = this.globalService.getIndexFromArray(this.select_blank_options, this.select_blank_values[0]);
        if (i >= 0)
            this.select_blank_options.splice(i, 1, this.strOptionSentence);
        
        this.show_editoption = true;
        this.show_chngoption = false;
        this.dis_editoption = true;
        this.dis_deleteoption = true;
    }
    onDeleteBlank() {
        for (var i = 0;  i < this.select_blank_values.length;  i++) {
            var j = this.globalService.getIndexFromArray(this.select_blank_options, this.select_blank_values[i]);
            if (j >= 0)
                this.select_blank_options.splice(j, 1);
        }
        this.dis_editoption = true;
        this.dis_deleteoption = true;
    }
    onUpBlank() {
        var selCount = this.select_blank_values.length;
        if (selCount != 1)
            return;

        var sel_val = this.select_blank_values[0];
        var options = this.select_blank_options;
        var i = this.globalService.getIndexFromArray(options, sel_val);
        if (i > 0) {
            var tmp = options[i];
            options[i] = options[i - 1];
            options[i - 1] = tmp;
        }
    }
    onDownBlank() {
        var selCount = this.select_blank_values.length;
        if (selCount != 1)
            return;

        var sel_val = this.select_blank_values[0];
        var options = this.select_blank_options;
        var i = this.globalService.getIndexFromArray(options, sel_val);
        if (i < options.length - 1) {
            var tmp = options[i];
            options[i] = options[i + 1];
            options[i + 1] = tmp;
        }
    }

    onAddSelectToList() {
        if (this.select_blank_options.length == 0)
            return;

        var blank_select = { id: 0, select_value: "", options: [""] };
        if (this.select_blank_values.length == 1)
            blank_select.select_value = this.select_blank_values[0];
        else
            blank_select.select_value = this.select_blank_options[0];
        blank_select.options = [];
        for (var i = 0;  i < this.select_blank_options.length;  i++)
            blank_select.options.push(this.select_blank_options[i]);
        
        var max_id: number = 0;
        for (var i = 0;  i < this.blank_selectlist.length;  i++) {
            if (this.blank_selectlist[i].id > max_id)
                max_id = this.blank_selectlist[i].id;
        }
        max_id++;
        blank_select.id = max_id;
        this.blank_selectlist.push(blank_select);
        this.select_blank_options = [];
        this.select_blank_values = [];
        this.strOptionSentence = "";
        this.optionsentence.nativeElement.focus();
    }

    onAddSelect(event: any, i: number) {
        if (event.x == 0  &&  event.y == 0)
            return;
        if (this._CKEDITOR.instances.ck_editor == null)
            return;
        if (this.blank_selectlist[i] == null)
            return;
        
        var html = "<select name=\"sel_" + this.blank_selectlist[i].id + "\"";
        html = html + ">";
        for (var j = 0;  j < this.blank_selectlist[i].options.length;  j++) {
            html = html + "<option value=\"" + this.blank_selectlist[i].options[j] + "\"";
            if (this.blank_selectlist[i].select_value == this.blank_selectlist[i].options[j])
                html = html + " selected=\"1\"";
            html = html + ">" + this.blank_selectlist[i].options[j] + "</option>";
        }
        html = html + "</select>";
        //this.repairCkData();
        this._CKEDITOR.instances.ck_editor.insertHtml( html );
        //this.checkCkEditorInfo();
        this.optionsentence.nativeElement.focus();
    }
    onDeleteSelect(i: number) {
        if (i < 0) return;
        this.blank_selectlist.splice(i, 1);
        this.checkCkEditorInfo();
    }

    onKeydownDiffer(event: any) {
        if (event.keyCode == 13) {
            this.onBlankClick();
        }
    }

    wizard_flag: boolean = false;

    createWizard() {
        if (this.wizard_flag)
            return;

        var form = $('#submit_form');
        var error = $('.alert-danger', form);
        var success = $('.alert-success', form);
        var that = this;
        
        var tabs = $('#form_wizard_1 ul li');
        var navs = $('#form_wizard_1 ul.nav');
        this.handleTitle(tabs[0], $(navs[0]), 0);
        $(tabs).removeClass("active");
        $(tabs).find('a').css("aria-expanded", "false");
        $(tabs[0]).addClass("active");
        $('a', tabs[0]).addClass("active");
        $('a', tabs[0]).css("aria-expanded", "true");
        var tabpans = $('#form_wizard_1 .tab-content .tab-pane');
        $(tabpans).removeClass("active");
        $(tabpans[0]).addClass("active");
        $('#form_wizard_1').find('.progress-bar').css({
            width: 100/3 + '%'
        });
        $('.form-actions button').removeClass("disabled");
        
        $('#form_wizard_1').bootstrapWizard({
            'nextSelector': '.button-next',
            'previousSelector': '.button-previous',
            onTabClick: function (tab: any, navigation: any, index: any, clickedIndex: any) {
                return false;
            },
            onNext: function (tab: any, navigation: any, index: any) {
                success.hide();
                error.hide();

                if (form.$valid == false) {
                    return false;
                }
                if (index == 0  &&  that.editedProblem.guide == "") {
                    $('textarea[name=guide]').focus();
                    return false;
                }

                that.handleTitle(tab, navigation, index);
            },
            onPrevious: function (tab: any, navigation: any, index: any) {
                success.hide();
                error.hide();

                that.handleTitle(tab, navigation, index);
            },
            onTabShow: function (tab: any, navigation: any, index: any) {
                var total = navigation.find('li').length;
                var current = index + 1;
                var $percent = (current / total) * 100;
                $('#form_wizard_1').find('.progress-bar').css({
                    width: $percent + '%'
                });
            }
        });

        $('#form_wizard_1').find('.button-next').show();
        $('#form_wizard_1').find('.button-previous').hide();
        $('#form_wizard_1 .button-submit').hide();
        this.wizard_flag = true;
    }

    handleTitle(tab: any, navigation: any, index: any) {
        var total = navigation.find('li').length;
        var current = index + 1;
        // set wizard title
        $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
        // set done steps
        $('li', $('#form_wizard_1')).removeClass("done");
        var li_list = navigation.find('li');
        for (var i = 0; i < index; i++) {
            $(li_list[i]).addClass("done");
        }

        if (current == 1) {
            $('#form_wizard_1').find('.button-previous').hide();
        } else {
            $('#form_wizard_1').find('.button-previous').show();
        }

        if (current >= total) {
            $('#form_wizard_1').find('.button-next').hide();
            $('#form_wizard_1').find('.button-submit').show();
            //displayConfirm();
        } else {
            $('#form_wizard_1').find('.button-next').show();
            $('#form_wizard_1').find('.button-submit').hide();
        }
        Metronic.scrollTo($('.page-title'));
    }

    onUploadSuccess(event: any) {
        this.uploadedFiles.push({
            uuid: event[0].upload.uuid,
            path: event[1].path
        });
    }

    onRemoveFile(event: any) {
        remove(this.uploadedFiles, ['uuid', event.upload.uuid]);
    }

    onDropNestedItem() {
        this.editedProblem.content.select.options = map(this.nestedList, o => o.value);
    }

    updateNestedList() {
        this.nestedList = map(this.editedProblem.content.select.options, option => ({ value: option }))
    }
}
