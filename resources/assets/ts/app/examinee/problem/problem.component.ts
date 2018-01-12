import { Component, OnInit } from '@angular/core';
import { Problem } from '../../model/problem';
import { GlobalService } from '../../shared/services/global.service';

@Component({
  selector: 'app-problem',
  template: require('./problem.component.html'),
  styles: [`${require('./problem.component.css')}`],
  inputs: ['data'] 
})
export class ProblemComponent implements OnInit {
	data: number;
	currentProblem: Problem;

    constructor(private globalService: GlobalService) {
      	
    }
  	ngOnInit() {
  		
  	}

}
