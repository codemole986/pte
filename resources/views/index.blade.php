<!DOCTYPE html>
<html lang="en">
<head>
    <base href="/">
    <title>Quiz</title>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta content="width=device-width, initial-scale=1" name="viewport"/>
    <meta content="" name="description"/>
    <meta content="" name="author"/>
    
    <!-- <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/> -->

    <!-- <link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"> -->
    <link href="assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="assets/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css">
    <link href="assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
    <!-- <link href="assets/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css"> -->
    <!-- END GLOBAL MANDATORY STYLES -->
    <!-- BEGIN PAGE LEVEL PLUGIN STYLES -->
    <link href="assets/global/plugins/jqvmap/jqvmap/jqvmap.css" rel="stylesheet" type="text/css">
    <link href="assets/global/plugins/morris/morris.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" type="text/css" href="assets/global/plugins/select2/select2.css">
    <link href="assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css" rel="stylesheet" type="text/css">
    <link href="assets/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet" type="text/css">
    <link href="assets/global/plugins/datatables/examples/resources/jqueryui/dataTables.jqueryui.css" rel="stylesheet" type="text/css">
    <link href="assets/global/plugins/jquery-nestable/jquery.nestable.css" rel="stylesheet" type="text/css"/>
    <!-- END PAGE LEVEL PLUGIN STYLES -->
    <!-- BEGIN PAGE STYLES -->
    <link href="assets/pages/css/tasks.css" rel="stylesheet" type="text/css"/>
    <!-- END PAGE STYLES -->
    <!-- BEGIN THEME STYLES -->
    <!-- DOC: To use 'rounded corners' style just load 'components-rounded.css' stylesheet instead of 'components.css' in the below style tag -->
    <link href="assets/global/css/components-rounded.css" id="style_components" rel="stylesheet" type="text/css">
    <link href="assets/global/css/plugins.css" rel="stylesheet" type="text/css">
    <link href="assets/layout/css/layout.css" rel="stylesheet" type="text/css">
    <link href="assets/layout/css/themes/default.css" rel="stylesheet" type="text/css" id="style_color">
    <link href="assets/layout/css/custom.css" rel="stylesheet" type="text/css">
    <link href="assets/frontend/layout/css/style.css" rel="stylesheet" type="text/css">
    <!-- END THEME STYLES -->
    <link rel="shortcut icon" href="favicon.ico">

    <!-- <link rel="stylesheet" type="text/css" href="assets/css/basic.min.css"/> -->
    <link rel="stylesheet" type="text/css" href="assets/css/dropzone.min.css"/>
    <!-- <link rel="stylesheet" type="text/css" href="assets/css/common.css"/> -->
</head>

<body>
<app-root></app-root>

    <script src="{{asset('assets/global/plugins/jquery.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/jquery-migrate.min.js')}}" type="text/javascript"></script>
    <!-- IMPORTANT! Load jquery-ui.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
    <script src="{{asset('assets/global/plugins/jquery-ui/jquery-ui.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/bootstrap/js/bootstrap.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/jquery.blockui.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/uniform/jquery.uniform.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/jquery.cokie.min.js')}}" type="text/javascript"></script>
    <!-- END CORE PLUGINS -->
    <!-- BEGIN PAGE LEVEL PLUGINS -->
    <script src="{{asset('assets/global/plugins/jqvmap/jqvmap/jquery.vmap.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.russia.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.world.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.europe.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.germany.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.usa.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/jqvmap/jqvmap/data/jquery.vmap.sampledata.js')}}" type="text/javascript"></script>
    <!-- IMPORTANT! fullcalendar depends on jquery-ui.min.js for drag & drop support -->
    <script src="{{asset('assets/global/plugins/morris/morris.min.js')}}" type="text/javascript"></script>
    <script type="text/javascript" src="{{asset('assets/global/plugins/select2/select2.min.js')}}"></script>
    <script src="{{asset('assets/global/plugins/morris/raphael-min.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/jquery.sparkline.min.js')}}" type="text/javascript"></script>
    <!-- END PAGE LEVEL PLUGINS -->
    <!-- BEGIN PAGE LEVEL PLUGINS -->
    <script src="{{asset('assets/global/plugins/flot/jquery.flot.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/flot/jquery.flot.resize.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/flot/jquery.flot.pie.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/flot/jquery.flot.stack.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/flot/jquery.flot.crosshair.min.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/plugins/flot/jquery.flot.categories.min.js')}}" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
    <!-- BEGIN PAGE LEVEL SCRIPTS -->
    <script src="{{asset('assets/global/scripts/metronic.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/layout/scripts/layout.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/layout/scripts/demo.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/pages/scripts/index3.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/pages/scripts/tasks.js')}}" type="text/javascript"></script>
    <script src="{{asset('assets/global/scripts/datatable.js')}}"></script>
    <script src="{{asset('assets/pages/scripts/table-managed.js')}}"></script>
    <!-- <script src="{{asset('assets/pages/scripts/charts-flotcharts.js')}}" type="text/javascript"></script> -->
    <!-- END PAGE LEVEL SCRIPTS -->
    <script type="text/javascript" src="{{asset('assets/global/plugins/datatables/media/js/jquery.dataTables.min.js')}}"></script>
    <script type="text/javascript" src="{{asset('assets/global/plugins/jquery-validation/js/jquery.validate.min.js')}}"></script>
    <script type="text/javascript" src="{{asset('assets/global/plugins/jquery-validation/js/additional-methods.min.js')}}"></script>
    <script type="text/javascript" src="{{asset('assets/global/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js')}}"></script>
    <script type="text/javascript" src="{{asset('assets/global/plugins/jquery-nestable/jquery.nestable.js')}}"></script>
    <!-- <script type="text/javascript" src="{{asset('js/jquery-2.2.4.min.js')}}"></script>
    <script type="text/javascript" src="{{asset('js/bootstrap.js')}}"></script> -->
    <script type="text/javascript" src="{{asset('js/angular.min.js')}}"></script>
    <!-- <script type="text/javascript" src="{{asset('js/metronic.js')}}"></script> -->

    <script type="text/javascript" src="{{asset('js/ckeditor/ckeditor.js')}}"></script>
    <script type="text/javascript" src="{{asset('js/recordmp3.js')}}"></script>
    <script type="text/javascript" src="{{asset('js/audio.js')}}"></script>    
    <script type="text/javascript" src="{{asset('js/dropzone.js')}}"></script>
    <script type="text/javascript" src="{{asset('js/ng-dropzone.js')}}"></script>
    <script type="text/javascript" src="{{asset('js/bootbox/bootbox.min.js')}}"></script>

    <script>
    jQuery(document).ready(function() {    
        Metronic.init(); // init metronic core componets
        Layout.init(); // init layout
        Demo.init(); // init demo(theme settings page)
        //Index.init(); // init index page
        /*ChartsFlotcharts.init();
        ChartsFlotcharts.initCharts();
        ChartsFlotcharts.initPieCharts();
        ChartsFlotcharts.initBarCharts();*/
        $('.scroll-to-top').click(function(e) {
            e.preventDefault();
            $('html, body').animate({scrollTop: 0}, 500);
            return false;
        });
    });
    window.sessionStorage.setItem('AUTH0_DOMAIN', "{{env('AUTH0_DOMAIN', '')}}");
    window.sessionStorage.setItem('AUTH0_CLIENT_ID', "{{env('AUTH0_CLIENT_ID', '')}}");
    </script>

    <script type="text/javascript" src="{{asset('js/app.js')}}"></script>

</body>
</html>
