import { Component, OnInit, Directive, OnDestroy, OnChanges } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { routerTransition } from '../router.animations';
import { GlobalService } from '../shared/services/global.service';
import { Problem } from '../model/problem';
import { TypeRenderComponent } from '../test/type-render.component';
import { FileUploadDirective } from '../dashboard/file-upload.directive';
import { TranslateService } from '@ngx-translate/core';

declare var $:any;
declare var angular:any;
declare var bootbox: any;
declare var Metronic: any;
declare var Datatable: any;

@Component({
	selector: 'app-quizlist',
	template: require('./quizlist.component.html'),
	styles: [`${require('./quizlist.component.css')}`],
	animations: [routerTransition()],
	providers: [GlobalService]
})
export class QuizlistComponent implements OnInit, OnDestroy {
	curselectedrowid: number;
    categoryNames: any[];
    _stoken: string;
    active_menu: string = "overview";

    arr_types: any[];
    quizgrid: any;
    
    constructor(private http: Http, private route: ActivatedRoute, private router: Router, private globalService: GlobalService, private translate: TranslateService) { 
        if(this._stoken==null) {
            this._stoken = window.sessionStorage.getItem("_token");
        }
    }

    ngOnDestroy() {
        $("#searchcategory").data("select2").destroy();
    }

	ngOnInit() {
        switch(window.sessionStorage.getItem('permission')) {
            case 'A' : this.active_menu = "manage"; break;
            case 'B' : this.active_menu = "teacher"; break;
            case 'D' : this.active_menu = "student"; break;
            default : this.active_menu = "overview";
        }

        this.categoryNames = this.globalService.quizCategoryNames;

        var that = this;

        $("#searchcategory").select2({
            allowClear: true,
            width: 140,
            minimumInputLength: 0,
            placeholder: "Select a Category",
            query: function (query: any) {
                var data = {
                    results: that.categoryNames
                };
                query.callback(data);
            }       
        });

        $("#searchcategory").on('change', function(){
            $("#searchtype").data("select2").data('');
        });

        $("#searchtype").select2({
            allowClear: true,
            width: 250,
            minimumInputLength: 0,
            placeholder: "Select a Category",
            query: function (query: any) {
                var data;
                data = {
                    results: []
                };
                if($('#searchcategory').val()==''){
                    var def_cat = ['Writing', 'Listening', 'Reading', 'Speaking'];
                    if(def_cat instanceof Array) {
                        for (var i=0; i < def_cat.length; i++) {
                            data.results = data.results.concat( that.globalService.problemTypes[ def_cat[i] ] );
                        }
                    }
                    
                } else {
                    data = {
                        results: that.globalService.problemTypes[$('#searchcategory').val()]
                    };
                }
                query.callback(data);
            }       
        });


        this.quizgrid = $("#quiztable").DataTable({
            serverSide: true,
            stateSave: true,

            "ordering": false,
            "info": true,
            "searching": false,  

            "ajax": {
                "type": "GET",
                "async": true,
                "url": "/problem/getproblems", 
                "data": function (d: any){                    
                    d.category = $('#searchcategory').val(); 
                    d.type = $('#searchtype').val(); 
                    return d;
                },                   
                "dataSrc": "data",
                "dataType": "json",
                "cache":    false,
            },

            "columnDefs": [ {
                "targets": [1],
                "createdCell": function (td: any, cellData: any, rowData: any, row: any, col: any) {
                    var str_contract = that.getTypeName(rowData["category"], cellData);
                    $(td).html(str_contract);
                }
            }],
            
            columns:[
                {title: "Category", data:"category", class:"center", searchable:"false"},                
                {title: "Type", data:"type", class:"left", searchable:"false"}, 
                //{title: "Degree", data:"degree"}, 
                {title: "Title", data:"title", class:"left", searchable:"false"}, 
                {title: "PreparationTime(s)", data:"preparation_time", class:"right", searchable:"false"},
                {title: "LimitTime(s)", data:"limit_time", class:"right", searchable:"false"}, 
                //{title: "Points", data:"points", class:"right"}, 
                {title: "Creater", data:"email", class:"left", searchable:"false"}, 
                {title: "Action", class:"center", searchable:"false", width:"100", render: function(data: any, type: any, row: any){
                    var str_previewquiz = '<a href="javascript:;" id="quizpreview_'+row.id+'" style="font-size: 18px; margin-right: 5px;"><i class="fa fa-play fa-fw"></i></a>';

                    var str_editquiz = '<a href="javascript:;" id="quizedit_'+row.id+'" style="font-size: 18px; margin-right: 5px;"><i class="fa fa-edit fa-fw"></i></a>';

                    var str_del = '<a href="javascript:;" id="del_'+row.id+'" style="font-size: 18px;"><i class="fa fa-trash-o fa-fw"></i></a>';

                    setTimeout(function(){
                        $('#quizpreview_'+row.id).on('click', function(e:any) {
                            that.router.navigate(['/quiz', row.id]);
                        });

                        $('#quizedit_'+row.id).on('click', function(e:any) {
                            that.router.navigate(['/quizedit/edit/', row.id]);
                        });

                        $('#del_'+row.id).on('click', function(e:any) {
                            that.translate.stream("Are you sure you want to delete?").subscribe((res: any) => {
                                bootbox.confirm(res, function(result: any){
                                   if(result) {
                                    that.http.get("/problem/delete/"+row.id).
                                    map(
                                         (response) => response.json()
                                      ).
                                      subscribe(
                                      (data) => {
                                        if(data.state == "error"){
                                            Metronic.showErrMsg(data.message);
                                        } else {
                                            that.quizgrid.ajax.reload('', false);
                                        }          
                                      }
                                    );
                                 }                  
                               });
                            });
                        });
                    }, 200);

                    return str_previewquiz+" | "+str_editquiz+" | "+str_del;
                }},
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

            "dom": '<"top">t<"bottom"irp><"clear">', 
            firstAjax: false,  
        });

        $('#quiztable tbody').on( 'click', 'tr', function () {
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');
            } else {
                that.quizgrid.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        } );

        Metronic.init();        
    }

    onRowDelete(rowid: number) {
        var that = this;
        this.translate.stream("Are you sure you want to delete?").subscribe((res: any) => {
            bootbox.confirm(res, function(result: any){
               if(result) {
                that.http.get("/problem/delete/"+rowid).
                map(
                     (response) => response.json()
                  ).
                  subscribe(
                  (data) => {
                    if(data.state == "error"){
                        Metronic.showErrMsg(data.message);
                    } else {
                        that.quizgrid.ajax.reload('', false);
                    }          
                  }
                );
             }                  
           });
        });
    }

    searchQuizList(){
        this.quizgrid.ajax.reload();             
    };

    getTypes(category: string) {
        return this.globalService.problemTypes[category];
    }

    getTypeName(category: string, value: string) {
        this.arr_types = this.getTypes(category);
        for (var i = 0;  i < this.arr_types.length; i++) {
            if (this.arr_types[i].value == value)
                return this.arr_types[i].title;
        }
        return '';
    }

}
