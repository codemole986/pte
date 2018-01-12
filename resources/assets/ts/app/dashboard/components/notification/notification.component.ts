import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-notification',
    template: require('./notification.component.html'),
    styles: [`${require('./notification.component.css')}`]
})
export class NotificationComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
}
