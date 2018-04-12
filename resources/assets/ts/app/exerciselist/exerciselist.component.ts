import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Router, ActivatedRoute, ActivationEnd  } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { routerTransition } from '../router.animations';
import { GlobalService } from '../shared/services/global.service';
import { Problem } from '../model/problem';
import { Answer } from '../model/answer';
import { TypeRenderComponent } from '../test/type-render.component';
import { TranslateService } from '@ngx-translate/core';

declare var $:any;
declare function startRecording(a: any, b: any, c: any, d: any): any;
declare function stopRecording(): any;
declare var bootbox: any;
declare var Metronic: any;
declare var Datatable: any;

@Component({
  	selector: 'app-exercise',
  	template: require('./exerciselist.component.html'),
	styles: [`${require('./exerciselist.component.css')}`],	
    animations: [routerTransition()],
	providers: [GlobalService]  
})
export class ExerciselistComponent implements OnInit, OnDestroy {
	_token : string = window.sessionStorage.getItem('_token');
	active_menu: string = "overview";

	exercisegrid: any;
	
    constructor(private http: Http, private route: ActivatedRoute, private router: Router, private globalService: GlobalService, private translate: TranslateService) { 

	}

	ngOnInit() {
		switch(window.sessionStorage.getItem('permission')) {
    		case 'A' : this.active_menu = "manage"; break;
			case 'B' : this.active_menu = "teacher"; break;
			case 'D' : this.active_menu = "student"; break;
			default : this.active_menu = "overview";
    	} 

        var that = this;

        $("#searchcategory").select2({
            allowClear: true,
            width: 150,
            minimumInputLength: 0,
            placeholder: "Select a Category",
            query: function (query: any) {
                var data = {
                    results: that.globalService.quizCategoryNames
                };
                query.callback(data);
            }       
        });

        $("#searchtype").select2({
            allowClear: true,
            width: 250,
            minimumInputLength: 0,
            placeholder: "Select a Category",
            query: function (query: any) {
                var data = {
                    results: that.globalService.problemTypes[$('#searchcategory').val()]
                };
                query.callback(data);
            }       
        });
    	
    	that.exercisegrid = $("#exercisetable").DataTable({
            serverSide: true,
            stateSave: false,

            "ordering": false,
            "info": true,
            "searching": false,  

            "ajax": {
                "type": "GET",
                "async": true,
                "url": "/answer/getexerciseanswers",
                "data": function (d: any){
                	d.category = $('#searchcategory').val(); 
                    d.type = $('#searchtype').val(); 
                	return d;
                },                   
                "dataSrc": "data",	
                "dataType": "json",
                "cache":    false,
            },
            
            columns:[
            	{title: "Date", data:"end_time", class:"center", "render": function (data: any) {
                        if(data == '' || data=='null')
                            return '';                      
                        var date = new Date(data);
                        var month: any;
                        month = date.getMonth() + 1;
                        return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
                    }
                },
                {title: "User Email", data:"email"},
                {title: "Category", data:"category", class:"center"},
                {title: "Type", data:"type", render: function(data: any, type: any, row: any){
                        return that.getTypeName(row["category"], data);
                    }
                },
                {title: "Title", data:"title"}, 
                {title: "PreparationTime(s)", data:"preparation_time", format:"number", class:"right"},
                {title: "LimitTime(s)", data:"limit_time", format:"number", class:"right"},
                //{title: "Mark", data:"evaluate_mark", format:"number", class:"right"}, 
            ], 

            scrollY: false,
            scrollX: false,
            scrollCollapse: false,
            jQueryUI: true,  

            "lengthMenu": [
                [5, 10, 20, 50, 150],
                [5, 10, 20, 50, 150] // change per page values here
            ],

            "paging": true,
            "pagingType": "full_numbers",           
            "pageLength": 10, 

            "dom": '<"top">it<"bottom"rp><"clear">',
        });

	        
        $('#exercisetable tbody').on( 'click', 'tr', function () {
			if ( !$(this).hasClass('selected') ) {				
				that.exercisegrid.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
			}
		} ); 	    
    }
    

	ngOnDestroy() {
           
    }

	searchExerciseList(){
        this.exercisegrid.ajax.reload();             
    };

    getTypeName(category: string, value: string) {
        var arr_types = this.globalService.problemTypes[category];
        if(arr_types!=null){
            for (var i = 0;  i < arr_types.length; i++) {
                if (arr_types[i].value == value)
                    return arr_types[i].title;
            }
        }
        
        return '';
    }
}
