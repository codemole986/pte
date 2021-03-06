﻿import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule} from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TeacherComponent } from './dashboard/dashboard.component';
import { OverviewComponent } from './dashboard/dashboard.component';
import { DashStudentComponent } from './dashboard/dashboard.component';
import { DashManageComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { QuizlistComponent } from './quizlist/quizlist.component';
import { QuizeditComponent } from './quizedit/quizedit.component';
import { TestComponent } from './test/test.component';
import { StatusRenderComponent } from './test/status-render.component';
import { TypeRenderComponent } from './test/type-render.component';
import { ManageComponent } from './manage/manage.component';
import { PermissionRenderComponent } from './manage/permission-render.component';
import { ExerciseComponent } from './exercise/exercise.component';
import { ExerciselistComponent } from './exerciselist/exerciselist.component';
import { ExamineeComponent } from './examinee/examinee.component';
import { EvalexamComponent } from './evalexam/evalexam.component';
import { EvalstatusRenderComponent } from './evalexam/evalstatus-render.component';
import { EditorComponent } from './examinee/editor/editor.component';
import { ProblemComponent } from './examinee/problem/problem.component';
import { ConverttimestampPipe } from './examinee/examinee.converttimestamp';
import { FileUploadDirective } from './dashboard/file-upload.directive';
import { NumberprintPipe } from './dashboard/numberprint';

import {
    HeaderComponent, HeaderTeacherComponent, HeaderOverviewComponent, HeaderStudentComponent, HeaderManageComponent, 
    FooterComponent
} from './components';

import {
    AboutusComponent,
    ContactusComponent,
    InboxComponent,
    ProfileComponent
} from './pages';

import { NgbModule, NgbCarouselModule, NgbModalModule, NgbAlertModule, NgbDropdownModule, NgbProgressbarModule, NgbPaginationModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

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

import { AuthGuard, AuthService } from './shared';



export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        ManageComponent,
        PermissionRenderComponent,
        HeaderComponent,
        HeaderTeacherComponent,
        HeaderOverviewComponent, 
        HeaderStudentComponent, 
        HeaderManageComponent, 
        FooterComponent,
        AboutusComponent,
        ContactusComponent,
        InboxComponent,
        ProfileComponent,
        DashboardComponent,
        TeacherComponent,
        OverviewComponent,
        DashStudentComponent,
        DashManageComponent,
        FileUploadDirective,
        NumberprintPipe,
        LoginComponent,
        SignupComponent,        
        QuizlistComponent,
        QuizeditComponent,
        ExerciseComponent,
        ExerciselistComponent,
        TestComponent,
        StatusRenderComponent,
        TypeRenderComponent,        
        ExamineeComponent,
        EvalexamComponent,
        EvalstatusRenderComponent,
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
        NbCardModule,
        NgbModule.forRoot(),        
        NgbDropdownModule.forRoot(),
        NgbModalModule.forRoot(),
        NgbAlertModule.forRoot(),
        NgbProgressbarModule.forRoot(),
        NgbPaginationModule.forRoot(),
        NgbCarouselModule.forRoot(),
        NgbAccordionModule.forRoot(),
        
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        
        RouterModule.forRoot([
            {
                path: '',
                component: DashboardComponent,
            },
            {
                path: 'manage',
                component: ManageComponent,
                canActivate: [AuthGuard]
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
                component: DashboardComponent,
                canActivate: [AuthGuard]
            },            
            {
                path: 'quizedit/:add/:category/:type',
                component: QuizeditComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'quizedit/:edit/:id',
                component: QuizeditComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'quizlist',
                component: QuizlistComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'exerciselist',
                component: ExerciselistComponent,
                canActivate: [AuthGuard]
            }, 
            {
                path: 'exercise',
                component: ExerciseComponent,
                canActivate: [AuthGuard]
            },  
            {
                path: 'exercise/:type',
                component: ExerciseComponent,
                canActivate: [AuthGuard]
            },       
            {
                path: 'test',
                component: TestComponent,
                canActivate: [AuthGuard]
            },            
            {
                path: 'examinee',
                component: ExamineeComponent,
                canActivate: [AuthGuard]
            },          
            {
                path: 'examinee/:testid',
                component: ExamineeComponent,
                canActivate: [AuthGuard]
            },           
            {
                path: 'quiz/:id',
                component: ExamineeComponent,
                canActivate: [AuthGuard]
            },           
            {
                path: 'eval',
                component: EvalexamComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'aboutus',
                component: AboutusComponent
            },
            {
                path: 'contactus',
                component: ContactusComponent
            },
            {
                path: 'inbox',
                component: InboxComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            }
        ]) 
	],
    entryComponents: [
        PermissionRenderComponent,
        StatusRenderComponent,
        TypeRenderComponent,
        EvalstatusRenderComponent
    ],
	providers: [AuthGuard, AuthService],
	bootstrap: [AppComponent]
})
export class AppModule { }
