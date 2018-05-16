import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd  } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { isEmpty, map } from 'lodash';

import { routerTransition } from '../router.animations';
import { GlobalService } from '../shared/services/global.service';
import { Problem } from '../model/problem';
import { Answer } from '../model/answer';
import { TypeRenderComponent } from '../test/type-render.component';

declare var $:any;
declare function startRecording(a: any, b: any, c: any, d: any): any;
declare function stopRecording(): any;
declare var bootbox: any;
declare var Metronic: any;
declare var SC: any;

@Component({
  selector: 'app-exercise',
  template: require('./exercise.component.html'),
  styles: [`${require('./exercise.component.css')}`],
  animations: [routerTransition()],
  providers: [GlobalService]
})
export class ExerciseComponent implements OnInit, OnDestroy {
  loadingQuizList: boolean = false;
  loadingQuiz: boolean = false;
  list: Problem[];
  limit: number = 5;
  offset: number = 0;
  count: number = 0;
  type: string = '';
  currentQuiz: Problem;
  remainingTime: number = 0;
  preTimerSubscription: Subscription;
  mainTimerSubscription: Subscription;
  step: number = 0;
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

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    Metronic.init();

    this.loadingQuizList = false;
    this.loadingQuiz = false;

    this.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        console.log('onenter');
      }
    });

    this.route.params.subscribe(params => {
      if (params.type) {
        this.type = params.type;
        this.getQuizList(this.type)
      }
    });
  }

  drawQuizGrid() {
    // this.quizgrid.ajax.reload('', false);
  }

  ngOnDestroy() {
    // clearInterval(this.ctimer);
  }

  getQuiz(id: number) {
    this.http.get(`/problem/getfullproblem/${id}`)
  }

  getQuizList(type: string, offset: number = 0, limit: number = 15) {
    this.http.get('/api/quiz', {
      params: {
        type,
        start: offset,
        length: limit
      }
    })
      .map(
        (response) => response.json()
      )
      .subscribe(
        ({ data, recordsFiltered, recordsTotal }) => {
          this.list = map(data, (d: Problem, index: number) => ({ ...d, no: index + this.offset * this.limit + 1 }));
          this.count = recordsTotal;

          if (this.list.length > 0 && isEmpty(this.currentQuiz)) {
            this.selectQuiz(this.list[0]);
          }
        }
      );
  }

  setPage(page: { limit: number, offset: number }) {
    this.limit = page.limit;
    this.offset = page.offset;

    this.getQuizList(this.type, this.offset, this.limit);
  }

  getTypes(category: string) {
    return this.globalService.problemTypes[category];
  }

  getTypeName(category: string, value: string) {
    const arr_types: { value: string, title: string }[] = this.getTypes(category);

    if(arr_types != null) {
      for (let i = 0;  i < arr_types.length; i++) {
        if (arr_types[i].value == value)
          return arr_types[i].title;
      }
    }

    return '';
  }

  selectQuizRow(row: { selected: Problem[] }) {
    if (row.selected.length > 0) {
      this.selectQuiz(row.selected[0]);
    }
  }

  selectQuiz(quiz: Problem) {
    const { preparation_time, limit_time, id } = quiz;

    if (!isEmpty(this.currentQuiz) && id === this.currentQuiz.id) {
      return;
    }

    this.currentQuiz = { ...quiz };

    this.startExercise();
  }

  startExercise() {
    if (isEmpty(this.currentQuiz)) return;

    const { preparation_time, limit_time, id } = this.currentQuiz;

    this.stopTimer(this.preTimerSubscription);
    this.stopTimer(this.mainTimerSubscription);

    this.step = 0;
    this.remainingTime = preparation_time;

    this.preTimerSubscription = this.startTimer(0, (t: number) => {
      this.remainingTime = preparation_time - t;

      if (this.remainingTime <= 0) {
        this.step = 1;
        this.remainingTime = limit_time;
        this.stopTimer(this.preTimerSubscription);

        this.mainTimerSubscription = this.startTimer(preparation_time, (t: number) => {
          this.remainingTime = limit_time - t;

          if (this.remainingTime <= 0) {
            this.step = 2;
            this.remainingTime = 0;
            this.stopTimer(this.mainTimerSubscription);
          }
        });
      }
    });
  }

  startTimer(delay: number, func: Function): Subscription {
    const timer = Observable.timer(delay, 1000);
    const subscription = timer.subscribe(t => {
      func(t);
    });

    return subscription;
  }

  stopTimer(subscription: Subscription) {
    if (subscription === undefined) return;
    subscription.unsubscribe();
  }
}
