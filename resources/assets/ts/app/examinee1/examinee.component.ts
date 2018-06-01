import { Component, OnInit, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute, ActivationEnd  } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { isEmpty } from 'lodash';

import { routerTransition } from '../router.animations';
import { Problem } from '../model/problem';
import { Answer } from '../model/answer';
import { TypeRenderComponent } from '../test/type-render.component';

import { GlobalService } from '../shared/services';

declare var $:any;
declare function startRecording(a: any, b: any, c: any, d: any): any;
declare function stopRecording(): any;
declare var bootbox: any;
declare var Metronic: any;

@Component({
  selector: 'app-examinee',
  template: require('./examinee.component.html'),
  styles: [`${require('./examinee.component.css')}`],
  animations: [routerTransition()],
  providers: [GlobalService]
})
export class ExamineeComponent implements OnInit {
  active_menu: string = 'overview';
  id: number;
  list: Problem[];
  limit: number = 5;
  offset: number = 0;
  count: number = 0;
  type: string = '';
  currentQuiz: Problem;
  prevQuiz: Problem;
  nextQuiz: Problem;

  private frequency: number = 1000;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
    private globalService: GlobalService,
  ) {
  }

  ngOnInit() {
    Metronic.init();

    switch(window.sessionStorage.getItem('permission')) {
      case 'A' : this.active_menu = 'manage'; break;
      case 'B' : this.active_menu = 'teacher'; break;
      case 'D' : this.active_menu = 'student'; break;
      default : this.active_menu = 'overview';
    }

    this.route.params.subscribe(params => {
      if (params.id) {
        this.id = params.id;
        this.currentQuiz = undefined;
        this.getQuiz(this.id);
      }
    });
  }

  getQuiz(id: number) {
    this.http.get(`/api/quiz/${id}`)
      .map(
        (response) => response.json()
      )
      .subscribe(
        (quiz: Problem) => {
          if (quiz) {
            this.selectQuiz(quiz);
          } else {
            this.router.navigate(['/quizlist']);
          }
        }
      );
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
  }

  onExitexaminee(quiz: Problem) {
    this.currentQuiz = undefined;
    this.router.navigate(['/quizlist']);
  }
}
