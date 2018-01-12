import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { routerTransition } from '../router.animations';
import { GlobalService } from '../shared/services/global.service';
import { Problem } from '../model/problem';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';


@Component({
    selector: 'app-dashboard',
    template: require('./dashboard.component.html'),
    styles: [`${require('./dashboard.component.css')}`],
    animations: [routerTransition()],
    providers: [GlobalService]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];

    httpdata: any[];

    gridsettings: any;
    //datasource: ServerDataSource;
    datasource: LocalDataSource = new LocalDataSource();
    
    arr_types: any[];
    i: number;
    charttype: String;
    chartdata: any;
    chartoptions: any;


    constructor(private http: Http, private router: Router, private globalService: GlobalService) {
        this.sliders.push(
            {
                imagePath: 'assets/images/slider1.jpg',
                label: 'First slide label',
                text:
                    'Nulla vitae elit libero, a pharetra augue mollis interdum.'
            },
            {
                imagePath: 'assets/images/slider2.jpg',
                label: 'Second slide label',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            },
            {
                imagePath: 'assets/images/slider3.jpg',
                label: 'Third slide label',
                text:
                    'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
            }
        );

        
    }

    ngOnInit() {
        this.getProblems();
        //this.datasource = new ServerDataSource(this.http, { endPoint: '/problem/getproblems' });
        this.charttype = 'bar';
        this.chartdata = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            
            datasets: [
                {
                    label: "My First dataset",              
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor:'rgba(75, 192, 192, 1)',
                    borderWidth: 1            
                },
                {
                    label: "My Second dataset",
                    data: [15, 79, 60, 91, 65, 75, 30],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255,99,132, 1)',
                    borderWidth: 1
                }
            ]
        };
        this.chartoptions = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgb(255, 99, 132)'
                }
            }
        };


        this.gridsettings = {
            mode: 'inline',
            selectMode: 'single',
            hideHeader: false,
            hideSubHeader: false,
            actions: {
                columnTitle: 'Actions',
                add: false,
                edit: false,
                'delete': false,                
                position: 'left'
            },            
            filter: {
                inputClass: '',
            },
            edit: {
                inputClass: '',
                editButtonContent: 'Edit',
                saveButtonContent: 'Update',
                cancelButtonContent: 'Cancel',
                confirmSave: false,
            },
            add: {
                inputClass: '',
                addButtonContent: 'Add New',
                createButtonContent: 'Create',
                cancelButtonContent: 'Cancel',
                confirmCreate: false,
            },
            delete: {
                deleteButtonContent: 'Delete',
                confirmDelete: false,
            },
            attr: {
                id: 'mygrid',
                class: 'table table-bordered table-hover table-striped',
            },
            noDataMessage: 'No data found',            
            pager: {
                display: true,
                perPage: 5,
            },
            columns: {
                category: {
                    title: 'Category'
                },
                type: {
                    title: 'Type'
                },
                degree: {
                    title: 'Degree'
                },
                title: {
                    title: 'Title'
                },
                maker: {
                    title: 'Creator'
                },
                created_at: {
                    title: 'Date'
                },
                examine: {
                    title: '',
                    type: 'html',

                }
            }
        };
    }

    getProblems() {
        this.http.get("/problem/getproblems").
        map(
            (response) => response.json()
        ).
        subscribe(
            (data) => {
                this.httpdata = data;
                this.datasource.load(data);
            }
        )
    }

    onCustom(event: any) {
        alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`)
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    getTypes(category: string) {
        return this.globalService.problemTypes[category];
    }

    getTypeName(category: string, value: string) {
        this.arr_types = this.getTypes(category);
        for (this.i = 0;  this.i < this.arr_types.length; this.i++) {
            if (this.arr_types[this.i].value == value)
                return this.arr_types[this.i].title;
        }
        return '';
    }

    goTestForm(prob_id: number) {
        this.router.navigate(['/problem', prob_id]);
    }
}
