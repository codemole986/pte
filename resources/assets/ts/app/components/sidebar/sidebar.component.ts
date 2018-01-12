import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    template: require('./sidebar.component.html'),
    styles: [`${require('./sidebar.component.css')}`]
})
export class SidebarComponent {
    isActive: boolean = false;
    showMenu: string = '';

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }
}
