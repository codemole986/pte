import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

declare var $:any;
declare var bootbox: any;
declare var Metronic: any;
declare var Layout: any;

@Component({
    selector: 'app-inbox',
    template: require('./inbox.component.html'),
    styles: [`${require('./inbox.component.css')}`]
})
export class InboxComponent implements OnInit {
    
    inboxStyle: string;
    active_menu: string = "overview";
    
    constructor(private translate: TranslateService, public router: Router) {

    }

    ngOnInit() {
    	this.inboxStyle = "inbox";

        switch(window.sessionStorage.getItem('permission')) {
            case 'A' : this.active_menu = "manage"; break;
            case 'B' : this.active_menu = "teacher"; break;
            case 'D' : this.active_menu = "student"; break;
            default : this.active_menu = "overview";
        }
    }

    showContent(type: string) {
    	this.inboxStyle = type;
    	var loading = $('.inbox-loading');
    	loading.show();
    	switch (type) {
    		case 'compose':
    			$('.inbox-nav > li.active').removeClass('active');
                $('.inbox-header > h1').text('Compose');
                $('.inbox-nav > li.compose-btn').addClass('active');
                
                /* $('.inbox-wysihtml5').wysihtml5({
		            "stylesheets": ["/assets/global/plugins/bootstrap-wysihtml5/wysiwyg-color.css"]
		        }); */
		        
		        $('.inbox-wysihtml5').focus();
                //Layout.fixContentHeight();
                Metronic.initUniform();
                //$('.inbox-nav > li.compose-btn').attr("disabled", false);
                loading.hide();
    			
    			break;
    		case 'inbox':
    			$('.inbox-nav > li.active').removeClass('active');
                $('.inbox-nav > li.inbox').addClass('active');
                $('.inbox-header > h1').text('Inbox');
                loading.hide();
    			break;
    		case 'sent':
    			$('.inbox-nav > li.active').removeClass('active');
                $('.inbox-nav > li.sent').addClass('active');
                $('.inbox-header > h1').text('Sent');
                loading.hide();
    			break;
    		case 'draft':
    			$('.inbox-nav > li.active').removeClass('active');
                $('.inbox-nav > li.draft').addClass('active');
                $('.inbox-header > h1').text('Draft');
                loading.hide();
    			break;
    		case 'trash':
    			$('.inbox-nav > li.active').removeClass('active');
                $('.inbox-nav > li.trash').addClass('active');
                $('.inbox-header > h1').text('Trash');
                loading.hide();
    			break;
    	}
    }

    showMessage(el: any) {
    	var loading = $('.inbox-loading');
    	loading.show();
        var message_id = $(el).parent('tr').attr("data-messageid");  
        $('.inbox-header > h1').text('View Message');

        loading.hide();
        this.inboxStyle = 'view';
        loading.hide();
    }
}
