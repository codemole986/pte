import { Component, Input, OnInit } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

@Component({
  template: `{{renderValue}}`,
})
export class StatusRenderComponent implements ViewCell, OnInit {

  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
  	switch(this.value) {
  		case 1 : this.renderValue = "Public"; break;
  		case 0 : this.renderValue = "Private"; break;
  	}
  }

}
