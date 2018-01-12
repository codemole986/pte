import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { HttpModule } from '@angular/http';

import { LoginComponent } from './login.component';
import { DashboardComponent } from './../dashboard/dashboard.component';
import { SignupComponent } from './../signup/signup.component';

@NgModule({
	imports: [
		CommonModule,
		HttpModule,
		RouterModule.forRoot([
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'signup',
                component: SignupComponent
            }
        ]) 
	],
	declarations: [LoginComponent, DashboardComponent, SignupComponent]
})
export class LoginModule { }
