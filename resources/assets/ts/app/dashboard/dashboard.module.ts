import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard.component';
import { StatModule } from '../shared';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        DashboardComponent
    ],
    bootstrap: [DashboardComponent]
})
export class DashboardModule {}
