import { Component, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd  } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { findIndex, isEmpty, map } from 'lodash';

import { routerTransition } from '../router.animations';
import { Problem } from '../model/problem';
import { Answer } from '../model/answer';
import { TypeRenderComponent } from '../test/type-render.component';

import { GlobalService } from '../shared/services';

@Component({
  selector: 'app-exercise',
  template: require('./exercise.component.html'),
  styles: [`${require('./exercise.component.css')}`],
  animations: [routerTransition()],
  providers: [GlobalService]
})
export class ExerciseComponent implements OnInit {
  active_menu: string = 'overview';
  list: Problem[];
  limit: number = 5;
  offset: number = 0;
  count: number = 0;
  type: string = '';
  currentQuiz: Problem;
  prevQuiz: Problem;
  nextQuiz: Problem;
  started: boolean = false;
  finished: boolean = false;
  step: string = '';
  elapsedTime: number = 0;
  showSolution: boolean = false;

  private frequency: number = 1000;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private globalService: GlobalService,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    switch(window.sessionStorage.getItem('permission')) {
      case 'A' : this.active_menu = 'manage'; break;
      case 'B' : this.active_menu = 'teacher'; break;
      case 'D' : this.active_menu = 'student'; break;
      default : this.active_menu = 'overview';
    }

    this.route.params.subscribe(params => {
      if (params.type) {
        this.type = params.type;
        this.currentQuiz = undefined;
        this.getQuizList(this.type);
      }
    });
  }

  ngAfterViewChecked(){
    this.changeDetector.detectChanges();
  }

  isPreStep(step: string): boolean {
    return step === this.globalService.STEP_PRE;
  }

  isMainStep(step: string): boolean {
    return step === this.globalService.STEP_MAIN;
  }

  isPostStep(step: string): boolean {
    return step === this.globalService.STEP_POST;
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
          } else {
            this.router.navigate(['/dashboard']);
          }
        }
      );
  }

  setPage({ limit, offset }: { limit: number, offset: number }) {
    this.limit = limit;
    this.offset = offset;

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

  selectQuizRow({ selected }: { selected: Problem[]}) {
    if (selected.length > 0) {
      this.selectQuiz(selected[0]);
    }
  }

  selectQuiz(quiz: Problem) {
    const { id } = quiz;

    if (!isEmpty(this.currentQuiz) && id === this.currentQuiz.id) {
      return;
    }

    this.currentQuiz = quiz;
    this.started = false;
    this.showSolution = false;

    const indexOfCurrentQuiz = findIndex(this.list, ['id', quiz.id]);

    if (indexOfCurrentQuiz > 0) {
      this.prevQuiz = this.list[indexOfCurrentQuiz - 1];
    }

    if (indexOfCurrentQuiz < this.list.length - 1) {
      this.nextQuiz = this.list[indexOfCurrentQuiz + 1];
    }
  }

  startExercise() {
    this.started = true;
    this.finished = false;
  }

  onStartExercise() {
    this.startExercise();
  }

  onRestartExercise() {
    this.startExercise();
  }

  onExitExercise(quiz: Problem) {
    this.currentQuiz = undefined;
    this.router.navigate(['/exerciselist']);
  }

  onSelectPrevQuiz(quiz: Problem) {
    this.selectQuiz(quiz);
  }

  onSelectNextQuiz(quiz: Problem) {
    this.selectQuiz(quiz);
  }

  onToggleSolution() {
    this.showSolution = !this.showSolution;
  }

  onUpdateStep(step: string) {
    this.step = step;

    if (this.isPostStep(this.step)) {
      this.finished = true;
    }
  }

  onUpdateElapsedTime(elapsedTime: number) {
    this.elapsedTime = elapsedTime;
  }
}
