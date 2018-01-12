import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule} from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { QuizlistComponent } from './quizlist/quizlist.component';
import { ManageComponent } from './manage/manage.component';
import { ExamineeComponent } from './examinee/examinee.component';
import { EditorComponent } from './examinee/editor/editor.component';
import { ProblemComponent } from './examinee/problem/problem.component';
import { ConverttimestampPipe } from './examinee/examinee.converttimestamp';


import {
    HeaderComponent,
    SidebarComponent
} from './components';
// import { NotificationComponent } from './dashboard/components/notification/notification.component';

import { NgbModule, NgbCarouselModule, NgbAlertModule, NgbDropdownModule, NgbProgressbarModule, NgbPaginationModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ChartModule } from 'angular2-chartjs';
import { NbCardModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import {
    TimelineComponent,
    NotificationComponent,
    ChatComponent
} from './dashboard/components';

import { AuthGuard } from './shared';


// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/QuizProject/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        ManageComponent,
        HeaderComponent,
        SignupComponent,
        DashboardComponent,
        LoginComponent,
        SignupComponent,        
        QuizlistComponent,
        ExamineeComponent,
        EditorComponent,
        ProblemComponent,
        ConverttimestampPipe,
        TimelineComponent,
        NotificationComponent,
        ChatComponent      
    ],
	imports: [
		CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        ChartModule,   
        Ng2SmartTableModule,     
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        NbCardModule,
        NgbModule.forRoot(),
        NgbDropdownModule.forRoot(),
        NgbProgressbarModule.forRoot(),
        NgbPaginationModule.forRoot(),
        NgbCarouselModule.forRoot(),
        NgbAccordionModule.forRoot(),
        RouterModule.forRoot([
            {
                path: '',
                component: LoginComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'manage',
                component: ManageComponent
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'signup',
                component: SignupComponent
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },            
            {
                path: 'quizlist',
                component: QuizlistComponent
            },            
            {
                path: 'examinee',
                component: ExamineeComponent
            },            
            {
                path: 'problem/:id',
                component: ExamineeComponent
            }
        ]) 
	],
	providers: [AuthGuard],
	bootstrap: [AppComponent]
})
export class AppModule { }
