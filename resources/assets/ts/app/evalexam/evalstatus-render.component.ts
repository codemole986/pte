import { Component, Input, OnInit } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

@Component({
  template: `{{renderValue}}`,
})
export class EvalstatusRenderComponent implements ViewCell, OnInit {

  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
  	switch(this.value) {
  		case 1 : this.renderValue = "Allow"; break;
  		case 2 : this.renderValue = "Evaluating"; break;
      case 3 : this.renderValue = "Complete"; break;
  	}
  }

}
