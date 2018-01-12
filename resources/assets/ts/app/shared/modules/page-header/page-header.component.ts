import { Component, OnInit, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-page-header',
    template: require('./page-header.component.html'),
    styles: [`${require('./page-header.component.css')}`]
})
export class PageHeaderComponent implements OnInit {
    @Input() heading: string;
    @Input() icon: string;
    constructor() {}

    ngOnInit() {}
}
