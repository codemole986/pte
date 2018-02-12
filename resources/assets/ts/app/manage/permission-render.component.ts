import { Component, Input, OnInit } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

@Component({
  template: `{{renderValue}}`,
})
export class PermissionRenderComponent implements ViewCell, OnInit {

  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
  	switch(this.value) {
  		case 'A' : this.renderValue = "Manager"; break;
  		case 'B' : this.renderValue = "Teacher"; break;
  		case 'C' : this.renderValue = "Evaluator"; break;
  		case 'D' : this.renderValue = "Student"; break;
  		case 'E' : this.renderValue = "Register"; break;
  	}
  }

}
