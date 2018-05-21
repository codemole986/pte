import { Component, OnInit, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute, ActivationEnd  } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { indexOf, isEmpty, map } from 'lodash';

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
declare var SC: any;

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
      if (params.type) {
        this.type = params.type;
        this.currentQuiz = undefined;
        this.getQuizList(this.type);
      }
    });
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
    const { preparation_time, limit_time, id, content } = quiz;
    const { audio } = content;
    const patternIframe = new RegExp('^<iframe(.+)</iframe>$');
    const patternSrc = new RegExp('(?<=src=").*?(?=["])');
    const patternAutoPlay = new RegExp('auto_play=(true|false)');

    if (!isEmpty(this.currentQuiz) && id === this.currentQuiz.id) {
      return;
    }

    if (audio && patternIframe.test(audio)) {
      let src = '';
      const matches = audio.match(patternSrc);

      if (matches.length > 0) {
        src = matches[0].replace(patternAutoPlay, 'auto_play=true');
        quiz.content.audio = src;
      }
    }

    this.currentQuiz = quiz;
  }
}
