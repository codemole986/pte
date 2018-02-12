import { Component, OnInit, Directive, OnDestroy, OnChanges } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
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

@Component({
	selector: 'app-quizlist',
	template: require('./quizlist.component.html'),
	styles: [`${require('./quizlist.component.css')}`],
	animations: [routerTransition()],
	providers: [GlobalService]
})
export class QuizlistComponent implements OnInit, OnDestroy {
	httpdata: any[];
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

	categoryNames: any[];
	types: any[];

	arr_types: any[];
	
    select_problem_values: any[];
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

    quizgridsettings: any;
    quizdatasource: ServerDataSource;
    curselectedrowid: number;

    editproblem_oldtype: string;
    thisDropzone: any;
    solutionDropzone: any;
    _stoken: string;
    
    constructor(private http: Http, private router: Router, private globalService: GlobalService) { 
        this._CKEDITOR = CKEDITOR;
        if(this._stoken==null) {
            this._stoken = window.sessionStorage.getItem("_token");
        }
    }

    ngOnDestroy() {
        if (this.thisDropzone) {
            this.thisDropzone.destroy();
        }

        if (this.solutionDropzone) {
            this.solutionDropzone.destroy();
        }
    }

	ngOnInit() {

        this.newproblem = false;
        this.editproblem = false;
		this.categoryNames = this.globalService.problemCategoryNames;
		this.curselectedrowid = -1;

		this.quizgridsettings = {
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
                id: 'quiztestgrid',
                class: 'table table-bordered table-hover table-striped',
            },
            noDataMessage: 'No data found',            
            pager: {
                display: true,
                perPage: 15,
            },
            columns: {
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
                email: {
                	title: "Creater"
                }
            }
        };

        this.quizdatasource = new ServerDataSource(this.http, {totalKey: "total", dataKey: "data", endPoint: '/problem/getproblems' });


	}
	
    
    getProblems() {
		this.http.get("/problem/getproblems").
		map(
			(response) => response.json()
		).
		subscribe(
			(data) => {
				this.httpdata = data;
			}
		)
	}

	onQuizRowSelect(event: any) {
		if(this.curselectedrowid == event.data.id) {
            this.curselectedrowid = -1;
            this.editedProblem = new Problem;
        } else {
            this.curselectedrowid = event.data.id;
            this.editedProblem = event.data;      
        }
    }

	showEditProblemForm() {
        if(this.curselectedrowid == -1) {
			window.alert("Select row.");
			return;
		}
		this.newproblem = false;
		this.editproblem = true;
        
        if (this.editedProblem.type == 'RSA') {
            this.select_solution_value = this.editedProblem.content.select.options[this.editedProblem.solution.optionno];
        } else if (this.editedProblem.type == 'RMA') {
            this.select_solution_values = [];
			for (var i = 0;  i < this.editedProblem.solution.optionno.length;  i++) {
				this.select_solution_values.push(this.editedProblem.content.select.options[ this.editedProblem.solution.optionno[i] ]);
			}
		} else if (this.editedProblem.type == 'RAN') {
            this.select_blank_values = [];
            this.select_blank_options = [];
            this.blank_selectlist = [];
            for (var i = 0;  i < this.editedProblem.content.selectlist.length;  i++) {
                var sel_id = -1;
                for (var j = 0;  j < this.editedProblem.solution.optionno.length;  j++) {
                    if (this.editedProblem.solution.optionno[j].id == i) {
                        sel_id = this.editedProblem.solution.optionno[j].option;
                        break;
                    }
                }
                var sel_value = "";
                if (sel_id >= 0)
                    sel_value = this.editedProblem.content.selectlist[i].options[sel_id];
                this.blank_selectlist.push({ "options" : this.editedProblem.content.selectlist[i].options,
                                             "select_value" : sel_value,
                                             "id" : i });
            }
            this.solution_selectlist = [];
            var optionno = [];
            for (var i = 0;  i < this.editedProblem.solution.optionno.length;  i++) {
                optionno.push(this.editedProblem.solution.optionno[i]);
            }
            this.solution_selectlist = { "optionno": optionno };
        }

        if(this.editedProblem.type =='SRS' || this.editedProblem.type =='SSA' || this.editedProblem.type =='LWS' || this.editedProblem.type =='LSA' || this.editedProblem.type =='LTW' || this.editedProblem.type =='LSB' ||  this.editedProblem.type =='LCD' || this.editedProblem.type =='LTS') {
            if (this.thisDropzone) {
                this.thisDropzone.destroy();
            }
            this.create_dropzone('audio');
        }

        if(this.editedProblem.type == 'RSA'  ||  this.editedProblem.type == 'RMA' || this.editedProblem.type =='SPI') {
            if (this.thisDropzone) {
                this.thisDropzone.destroy();
            }
            this.create_dropzone('picture');
        }

        if(this.editedProblem.type == 'SAL' || this.editedProblem.type == 'SRS' || this.editedProblem.type == 'SPI' || this.editedProblem.type == 'SSA') {
            if (this.solutionDropzone) {
                this.solutionDropzone.destroy();
            }
            this.create_solutiondropzone();
        }

		this.show_editoption = true;
        this.dis_editoption = true;
        this.show_chngoption = false;
        this.dis_deleteoption = true;
        this.strOptionSentence = "";
        this.select_problem_values = [];

        this.ck_flag = false;

        var that = this;
        setTimeout(function(){
                if (that.optionsentence != null) {
                    that.optionsentence.nativeElement.addEventListener('keydown', function(e: any) {
                        if (e.keyCode == 13) {
                            if (that.show_chngoption) {
                                if (that.editedProblem.type == 'RAN')
                                    that.onChangeBlank();
                                else
                                    that.onChangeOption();
                            } else {
                                if (that.editedProblem.type == 'RAN')
                                    that.onAddBlank();
                                else
                                    that.onAddOption();
                            }
                        }
                    });
                }
            },
        10);
	}

	showAddProblemForm() {
		this.editedProblem = new Problem;
		this.editedProblem.category = 'Writing';
		this.types = this.getTypes('Writing');
		this.editedProblem.type = this.types[0].value;
        this.initProblem();
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
        this.select_problem_values = [];
        this.select_blank_values = [];
        this.select_blank_options = [];
        this.blank_selectlist = [];
        
        this.ck_flag = false;        
        
        var that = this;
        setTimeout(function(){
                if (that.optionsentence != null) {
                    that.optionsentence.nativeElement.addEventListener('keydown', function(e: any) {
                        if (e.keyCode == 13) {
                            if (that.show_chngoption) {
                                if (that.editedProblem.type == 'RAN')
                                    that.onChangeBlank();
                                else
                                    that.onChangeOption();
                            } else {
                                if (that.editedProblem.type == 'RAN')
                                    that.onAddBlank();
                                else
                                    that.onAddOption();
                            }
                        }
                    });
                }
            },
        10);
    }

    onClickSave() {
        if(this.editedProblem.title == null || this.editedProblem.title.length == 0 || this.editedProblem.title.length > 255 ) {
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
            case 'LWS':
            case 'LTS':
            case 'LSA':
            case 'LSB':  
                if(this.thisDropzone.files.length>0) {
                    this.editedProblem.content.audio = this.thisDropzone.files[0].name;     
                }                
                break;              
            case 'LTW':  
            case 'LCD':      
                if(this.thisDropzone.files.length>0) {
                    this.editedProblem.content.audio = this.thisDropzone.files[0].name;     
                } 
                this.checkCkEditorInfo();
                break;
            case 'RSA' :                
            case 'RMA' :
                if(this.thisDropzone.files.length>0) {
                    this.editedProblem.content.picture = this.thisDropzone.files[0].name;     
                } 
                break;
            case 'RFB':
                this.checkCkEditorInfo();
                break;
            case 'RAN':
                this.checkCkEditorInfo();
                this.editedProblem.content.selectlist = [];
                for (var i = 0;  i < this.blank_selectlist.length;  i++) {
                    this.editedProblem.content.selectlist.push({ "options" : this.blank_selectlist[i].options });
                }
                this.editedProblem.solution = {};
                this.editedProblem.solution.optionno = [];
                for (var i = 0;  i < this.solution_selectlist.optionno.length;  i++) {
                    this.editedProblem.solution.optionno.push(this.solution_selectlist.optionno[i]);
                }
                break;
            case 'SSA' :
            case 'SRS' :
                if(this.thisDropzone.files.length>0) {
                    this.editedProblem.content.audio = this.thisDropzone.files[0].name;     
                } 

                if(this.solutionDropzone.files.length>0) {
                    this.editedProblem.solution.audio = this.solutionDropzone.files[0].name;     
                }  
                break;
            case 'SPI' :
                if(this.thisDropzone.files.length>0) {
                    this.editedProblem.content.picture = this.thisDropzone.files[0].name;     
                } 

                if(this.solutionDropzone.files.length>0) {
                    this.editedProblem.solution.audio = this.solutionDropzone.files[0].name;     
                }                 
                break;
            case 'SAL' :
                if(this.solutionDropzone.files.length>0) {
                    this.editedProblem.solution.audio = this.solutionDropzone.files[0].name;     
                }  
                break;
            case 'SRL' :
                break;            
        }

        this.savefalg = true;

        this.http.post("/problem/insert", this.editedProblem).
    	map(
            (response) => response.json()
        ).
        subscribe(
    		(data) => {
                if(data.state == "success") {
                    this.editedProblem.id = data.qid; 
                    if(this.thisDropzone && this.thisDropzone.files.length>0) {
                        this.thisDropzone.options.params.quizid = data.qid;
                        this.thisDropzone.uploadFiles(this.thisDropzone.files);
                    };

                    if(this.solutionDropzone && this.solutionDropzone.files.length>0) {
                        this.solutionDropzone.options.params.quizid = data.qid;
                        this.solutionDropzone.uploadFiles(this.solutionDropzone.files);
                    };

                    this.onClickList();                         
                } else {
                    alert(data.message);
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
            alert("Select problem.");            
        }
    }

    onClickPreview() {
        if(this.curselectedrowid != -1) {
            if(this.editedProblem.id!=null) {            
                this.router.navigate(['/problem', this.editedProblem.id]);
            }
        } else {
            alert("Select problem.");            
        }
    }

    onClickList() {
        this.newproblem = false;
        this.editproblem = false;
        this.savefalg = true;
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

        if(isNaN(this.editedProblem.limit_time) || this.editedProblem.limit_time < 0  ) {
            this.savefalg = false;
            return;
        }

        if(isNaN(this.editedProblem.points) || this.editedProblem.points < 0  ) {
            this.savefalg = false;
            return;
        }

        switch (this.editedProblem.type) {            
            case 'LWS':
            case 'LTS':
            case 'LSA':
            case 'LSB':  
                if(this.thisDropzone.files.length>0) {
                    this.editedProblem.content.audio = this.thisDropzone.files[0].name;     
                }                
                break;              
            case 'LTW':  
            case 'LCD':      
                if(this.thisDropzone.files.length>0) {
                    this.editedProblem.content.audio = this.thisDropzone.files[0].name;     
                } 
                this.checkCkEditorInfo();
                break;
            case 'RSA' :                
            case 'RMA' :
                if(this.thisDropzone.files.length>0) {
                    this.editedProblem.content.picture = this.thisDropzone.files[0].name;     
                } 
                break;
            case 'RFB':
                this.checkCkEditorInfo();
                break;
            case 'RAN':
                this.checkCkEditorInfo();
                this.editedProblem.content.selectlist = [];
                for (var i = 0;  i < this.blank_selectlist.length;  i++) {
                    this.editedProblem.content.selectlist.push({ "options" : this.blank_selectlist[i].options });
                }
                this.editedProblem.solution = {};
                this.editedProblem.solution.optionno = [];
                for (var i = 0;  i < this.solution_selectlist.optionno.length;  i++) {
                    this.editedProblem.solution.optionno.push(this.solution_selectlist.optionno[i]);
                }
                break;
            case 'SSA' :
            case 'SRS' :
                if(this.thisDropzone.files.length>0) {
                    this.editedProblem.content.audio = this.thisDropzone.files[0].name;     
                } 

                if(this.solutionDropzone.files.length>0) {
                    this.editedProblem.solution.audio = this.solutionDropzone.files[0].name;     
                }  
                break;
            case 'SPI' :
                if(this.thisDropzone.files.length>0) {
                    this.editedProblem.content.picture = this.thisDropzone.files[0].name;     
                } 

                if(this.solutionDropzone.files.length>0) {
                    this.editedProblem.solution.audio = this.solutionDropzone.files[0].name;     
                }                 
                break;
            case 'SAL' :
                if(this.solutionDropzone.files.length>0) {
                    this.editedProblem.solution.audio = this.solutionDropzone.files[0].name;     
                }  
                break;
            case 'SRL' :
                break; 
        }

    	this.http.post("/problem/update", this.editedProblem).
    	map(
            (response) => response.json()
        ).
        subscribe(
    		(data) => {
                if( data.state == "error") {
                    alert(data.message);
                } else {
                    if(this.thisDropzone && this.thisDropzone.files.length>0) {
                        this.thisDropzone.options.params.quizid = this.editedProblem.id;
                        this.thisDropzone.uploadFiles(this.thisDropzone.files);
                    };

                    if(this.solutionDropzone && this.solutionDropzone.files.length>0) {
                        this.solutionDropzone.options.params.quizid = this.editedProblem.id;
                        this.solutionDropzone.uploadFiles(this.solutionDropzone.files);
                    };

                    this.onClickList();
                }
    		}
    	);
    }

    onClickDelete() {
    	if(this.curselectedrowid == -1) {
    		window.alert('Select row.');
    	} else {
    		if(window.confirm('Are you sure you want to delete?')) {
		    	this.http.get("/problem/delete/"+this.curselectedrowid).
		    	map(
		            (response) => response.json()
		        ).
		        subscribe(
		    		(data) => {
	                    if( data.state == "error") {
		    			    alert(data.message);
	                    } else {
	                        this.quizdatasource.load(null);
	                    }
		    			
		    		}
		    	);
		    }
    	}
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
        setTimeout(() => {
            this.thisDropzone = new Dropzone(objdz_name, {
                url: '/problem/uploadfile',
                addRemoveLinks: true,
                autoQueue: false,
                maxFilesize: 5,
                params: {type:'quiz', quizid:'', _token: this._stoken}
            });

            if(ftype=='audio') {
                this.thisDropzone.options.acceptedFiles = "audio/mp3, audio/wav";
            } else if(ftype=='picture') {
                this.thisDropzone.options.acceptedFiles = "image/jpeg, images/jpg, image/png";
            }
            
        }, 100);
    }

    create_solutiondropzone() {
        setTimeout(() => {
            this.solutionDropzone = new Dropzone('#dzsolutionfile', {
                url: '/problem/uploadfile',
                addRemoveLinks: true,
                autoQueue: false,
                maxFilesize: 5,
                params: {type:'solution', quizid:'', _token: this._stoken}
            });

            this.solutionDropzone.options.acceptedFiles = "audio/mp3, audio/wav";            
        }, 100);
    }


    onSelectProbCategory(category: string, type: string) {
        if(this.editproblem_oldtype == null || this.editproblem_oldtype != type) {
            this.editedProblem.category = category
            this.editedProblem.type = type;
            this.editproblem_oldtype = type;
            this.initProblem();

            if(this.editedProblem.type == "LSB" || this.editedProblem.type =='SRS' || this.editedProblem.type =='SSA' || this.editedProblem.type =='LWS' || this.editedProblem.type =='LSA' || this.editedProblem.type =='LTW' || this.editedProblem.type =='LCD' || this.editedProblem.type =='LTS') {
                if (this.thisDropzone) {
                    this.thisDropzone.destroy();
                }
                this.create_dropzone('audio');

            } else if(this.editedProblem.type == 'RSA'  ||  this.editedProblem.type =='RMA' || this.editedProblem.type =='SPI') {
                if (this.thisDropzone) {
                    this.thisDropzone.destroy();
                }
                this.create_dropzone('picture');
            }

            if(this.editedProblem.type == 'SAL' || this.editedProblem.type == 'SRS' || this.editedProblem.type == 'SPI' || this.editedProblem.type == 'SSA') {
                if (this.solutionDropzone) {
                    this.solutionDropzone.destroy();
                }
                this.create_solutiondropzone();
            }
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

        if (this.editedProblem.type == 'RFB') {
            if (selCount == 1)
                this.str_blank = this.select_problem_values[0];
            else
                this.str_blank = '';
            this.checkCkEditorInfo();

            for (var i = 0;  i < this.editedProblem.solution.optionno.length;  i++) {
                if (this.editedProblem.content.select.options[this.editedProblem.solution.optionno[i]] == this.str_blank) {
                    this.str_blank = '';
                    return;
                }
            }
        }
    }

    onAddOption() {
    	if (this.validateOption() == false) {
    		//alert("Can't add empty or equal sentence in list");
    		return;
    	}
    	this.editedProblem.content.select.options.push(this.strOptionSentence);
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
    		//alert("Can't add empty or equal sentence in list");
    		return;
    	}
        var i = this.globalService.getIndexFromArray(this.editedProblem.content.select.options, this.select_problem_values[0]);
        if (i >= 0)
            this.editedProblem.content.select.options.splice(i, 1, this.strOptionSentence);
        
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
        this.dis_editoption = true;
    	this.dis_deleteoption = true;

        if (this.editedProblem.type == 'RFB') {
            this.checkCkEditorInfo();
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
    // solution
    onChangeSolutionSelect() {
        var i = this.globalService.getIndexFromArray(this.editedProblem.content.select.options, this.select_solution_value[0]);
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
/* ================================= RFB & LTW & LCD ============================== */
    onBlankClick() {
        if (this._CKEDITOR.instances.ck_editor == null)
            return;
        if (this.str_blank == null  ||  this.str_blank.length == 0)
            return;

        if (this.editedProblem.type == 'LCD') {

            this._CKEDITOR.instances.ck_editor.insertHtml( "<span style='background-color:#ff0'>" + this.str_blank + "</span>&nbsp;" );
        } else {
            this._CKEDITOR.instances.ck_editor.insertHtml( "<p><input type='text' value='" + this.str_blank + "'></p>" );
        }
        this.str_blank = '';
    }

    convertCkDataToContent() {
        switch (this.editedProblem.type) {
            case 'RFB':
                this.editedProblem.solution.optionno = [];
                var str_data = this._CKEDITOR.instances.ck_editor.getData();
                var reg = /(<input type=\"text\" value=\")([a-z, ,|]*)(\" \/>)/;
                var found = reg.test(str_data);
                var chngflag = false;
                while (found) {
                    var matches = reg.exec(str_data);
                    var blank = matches[2];
                    var index = this.globalService.getIndexFromArray(this.editedProblem.content.select.options, blank);
                    if (index < 0) {
                        str_data = str_data.replace(reg, "");
                    } else {
                        str_data = str_data.replace(reg, "{{}}");
                        this.editedProblem.solution.optionno.push(index);
                    }
                    found = reg.test(str_data);
                }
                this.editedProblem.content.text = str_data;
                break;
            case 'LTW':
                this.editedProblem.content.select.options = [];
                var str_data = this._CKEDITOR.instances.ck_editor.getData();
                var reg = /(<input type=\"text\" value=\")([a-z, ,|]*)(\" \/>)/;
                var found = reg.test(str_data);
                var chngflag = false;
                while (found) {
                    var matches = reg.exec(str_data);
                    var blank = matches[2];
                    str_data = str_data.replace(reg, "{{}}");
                    this.editedProblem.content.select.options.push(blank);
                    found = reg.test(str_data);
                }
                this.editedProblem.content.text = str_data;
                break;
            case 'LCD':
                this.editedProblem.content.select.options = [];
                var str_data = this._CKEDITOR.instances.ck_editor.getData();
                var reg = /(<span style=\"background-color:\#ff0\">)([a-z, ,|]*)(<\/span>)/;
                var found = reg.test(str_data);
                var chngflag = false;
                while (found) {
                    var matches = reg.exec(str_data);
                    var blank = matches[2];
                    str_data = str_data.replace(reg, "{{}}");
                    this.editedProblem.content.select.options.push(blank);
                    found = reg.test(str_data);
                }
                this.editedProblem.content.text = str_data;
                break;
            case 'RAN':
                this.solution_selectlist = {};
                this.solution_selectlist.optionno = [];
                var str_data = this._CKEDITOR.instances.ck_editor.getData();
                var reg = /(<select name=\"sel_)([0-9]*)(\">)((<option[a-z,A-Z, ,\",\=,0-9,_]*>[a-z,A-Z, ,\",\=,0-9,_]*<\/option>)*)[^]{0,1}(<\/select>)/;
                var found = reg.test(str_data);
                var chngflag = false;
                while (found) {
                    var matches = reg.exec(str_data);
                    var blank_id = matches[2];

                    var index = -1;
                    for (var i = 0;  i < this.blank_selectlist.length;  i++) {
                        if (blank_id == this.blank_selectlist[i].id) {
                            index = i;
                            break;
                        }
                    }
                    var sel_id = -1;
                    if (this.blank_selectlist[index] == null) {
                        index = -1;
                    } else {
                        for (var j = 0;  j < this.blank_selectlist[index].options.length;  j++) {
                            if (this.blank_selectlist[index].select_value == this.blank_selectlist[index].options[j])
                                sel_id = j;
                        }
                    }
                    if (index < 0) {
                        str_data = str_data.replace(reg, "");
                    } else {
                        str_data = str_data.replace(reg, "{{}}");
                        var obj = { id: 0, option: 0 };
                        obj.id = index; obj.option = sel_id;
                        this.solution_selectlist.optionno.push(obj);
                    }
                    found = reg.test(str_data);
                    
                }
                this.editedProblem.content.text = str_data;
                break;
        }
    }
    convertContentToCkData() {
        var content = this.editedProblem.content.text;
        switch (this.editedProblem.type) {
            case 'RFB':
                var reg = /\{\{\}\}/;
                var index = 0;
                var found = reg.test(content);
                while (found) {
                    var matches = reg.exec(content);
                    var text = this.editedProblem.content.select.options[this.editedProblem.solution.optionno[index++]];
                    content = content.replace(reg, "<input type='text' value='" + text + "'>");
                    found = reg.test(content);
                }
                this._CKEDITOR.instances.ck_editor.setData(content);
                break;
            case 'RAN':
                var reg = /\{\{\}\}/;
                var index = 0;
                var found = reg.test(content);
                while (found) {
                    var matches = reg.exec(content);
                    var sel_index = this.solution_selectlist.optionno[index].id;
                    var html = "<select name=\"sel_" + this.blank_selectlist[sel_index].id + "\"";
                    html = html + ">";
                    for (var j = 0;  j < this.blank_selectlist[sel_index].options.length;  j++) {
                        html = html + "<option value=\"" + this.blank_selectlist[sel_index].options[j] + "\"";
                        if (j == this.solution_selectlist.optionno[index].option)
                            html = html + " selected=\"1\"";
                        html = html + ">" + this.blank_selectlist[sel_index].options[j] + "</option>";
                    }
                    html = html + "</select>";
                    content = content.replace(reg, html);
                    found = reg.test(content);
                    index++;
                }
                this._CKEDITOR.instances.ck_editor.setData(content);
                break;
            case 'LTW':
                var reg = /\{\{\}\}/;
                var index = 0;
                var found = reg.test(content);
                while (found) {
                    var matches = reg.exec(content);
                    var text = this.editedProblem.content.select.options[index++];
                    content = content.replace(reg, "<input type='text' value='" + text + "'>");
                    found = reg.test(content);
                }
                this._CKEDITOR.instances.ck_editor.setData(content);
                break;
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
            //alert("Can't add empty or equal word in list");
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
            //alert("Can't add empty or equal word in list");
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
        this._CKEDITOR.instances.ck_editor.insertHtml( html );
        this.optionsentence.nativeElement.focus();
        //this.checkCkEditorInfo();
    }
    onDeleteSelect(i: number) {
        if (i < 0) return;
        this.blank_selectlist.splice(i, 1);
        this.checkCkEditorInfo();
    }
}
