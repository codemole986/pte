import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-chat',
    template: require('./chat.component.html'),
    styles: [`${require('./chat.component.css')}`]
})
export class ChatComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
}
