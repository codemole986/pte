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
import { TestComponent } from './test/test.component';
import { StatusRenderComponent } from './test/status-render.component';
import { TypeRenderComponent } from './test/type-render.component';
import { ManageComponent } from './manage/manage.component';
import { PermissionRenderComponent } from './manage/permission-render.component';
import { ExerciseComponent } from './exercise/exercise.component';
import { ExamineeComponent } from './examinee/examinee.component';
import { EvalexamComponent } from './evalexam/evalexam.component';
import { EvalstatusRenderComponent } from './evalexam/evalstatus-render.component';
import { EditorComponent } from './examinee/editor/editor.component';
import { ProblemComponent } from './examinee/problem/problem.component';
import { ConverttimestampPipe } from './examinee/examinee.converttimestamp';
import { FileUploadDirective } from './dashboard/file-upload.directive';

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
        PermissionRenderComponent,
        HeaderComponent,
        SignupComponent,
        DashboardComponent,
        FileUploadDirective,
        LoginComponent,
        SignupComponent,        
        QuizlistComponent,
        ExerciseComponent,
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
                canActivate: [AuthGuard]
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
                path: 'quizlist',
                component: QuizlistComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'exercise',
                component: ExerciseComponent,
                canActivate: [AuthGuard]
            },  
            {
                path: 'exercise/:id',
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
                path: 'problem/:id',
                component: ExamineeComponent,
                canActivate: [AuthGuard]
            },           
            {
                path: 'eval',
                component: EvalexamComponent,
                canActivate: [AuthGuard]
            }
        ]) 
	],
    entryComponents: [
        PermissionRenderComponent,
        StatusRenderComponent,
        TypeRenderComponent,
        EvalstatusRenderComponent
    ],
	providers: [AuthGuard],
	bootstrap: [AppComponent]
})
export class AppModule { }
