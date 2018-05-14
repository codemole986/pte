import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Router, ActivatedRoute, ActivationEnd  } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
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
export class ExerciseComponent implements OnInit, OnDestroy {
  // currentProblem: Problem;
  // currentAnswer: Answer;
  // currentpretime: number;
  // currentlimittime: number;
  // quiz_count: number = 0;
  // endbutton: boolean;
  // againbutton: boolean;
  // nextbutton: boolean;
  // previousbutton: boolean;
  // solutiontextvisible: boolean;
  // markvisible: boolean;
  // quiz_step: number;
  // ctimer: any;
  // i: number;
  // arr_types: any[];

  // radio_answer_val: string;
  // check_answer_val: any[];
  // check_solution_val: any[];

  // select_left_values: any[];
  // select_right_values: any[];
  // order_options: any[];
  // order_left_options: any[];
  // order_right_options: any[];

  // audio_flag: boolean = false;
  // audio_autoplay: boolean;

  // sel_audio_index: number;
  // audio_visible_flag: boolean;
  // record_start_time: number;
  // end_exam_flag: boolean;

  // rfb_content: string;
  // rfb_probhtml: string;
  // rfb_answerhtml: string;
  // rfb_solutionhtml: string;
  // rfb_options: any[];
  // rfb_selected_options: any[];

  // ran_content: string;
  // ran_selectlist: any[];

  // @ViewChild('htmldata') htmldata: ElementRef;
  // @ViewChild('choicepanel') choicepanel: ElementRef;
  // @ViewChild('html_answerdata') html_answerdata: ElementRef;

  // quiz_id: number;
  // nextquiz_id: number;
  // prevquiz_id: number;
  // progressvalue: number;
  // audiovisibleflag : boolean = false;

  // listflag : boolean = true;

  // _token : string = window.sessionStorage.getItem('_token');
  // active_menu: string = "overview";

  // quiztype: string;
  // quizgrid: any;
  // quizno: number;

  constructor(private http: Http, private route: ActivatedRoute, private router: Router, private globalService: GlobalService, private translate: TranslateService) {
  }

  ngOnInit() {
    Metronic.init();
  }

  drawQuizGrid() {
    // this.quizgrid.ajax.reload('', false);
  }

  ngOnDestroy() {
    // clearInterval(this.ctimer);
  }

  initialize() {
    // this.nextquiz_id = 0;
    // this.prevquiz_id = 0;
    // this.previousbutton = true;
    // this.nextbutton = true;
    // this.againbutton = false;
    // this.quiz_count = 0;
  }
}