import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from '../shared/services/global.service';
import { ViewCell } from 'ng2-smart-table';

@Component({
  template: `{{renderValue}}`,  
  providers: [GlobalService]
})
export class TypeRenderComponent implements ViewCell, OnInit {

  renderValue: string;
  typeNames: any[];

  @Input() value: string | number;
  @Input() rowData: any;

  constructor(private globalService: GlobalService) { 

  }

  ngOnInit() {
    
  	this.typeNames = this.globalService.quizTypeNames;
    for(var j = 0; j < this.typeNames.length; j++) {
      if(this.typeNames[j].value == this.value) {
        this.renderValue = this.typeNames[j].title;
        break;
      }
    }

  }

}
