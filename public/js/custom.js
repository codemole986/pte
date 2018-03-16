Dropzone.autoDiscover = false;

function create_dropzone() {
    
    var audioNgApp = angular.module('quizApp',[
        'thatisuday.dropzone'
    ])

    audioNgApp.config(function(dropzoneOpsProvider){
        dropzoneOpsProvider.setOptions({
            url : '/fileupload',
            maxFilesize : '10',   
            //acceptedFiles : 'audio/mp3',
            addRemoveLinks : true, 
            //params: {"type": "LWS", "kind":"problem"},                 
        });
    });

}




/*audioNgApp.controller('quizApp', function($scope){
    //Set options for dropzone
    //Visit http://www.dropzonejs.com/#configuration-options for more options
    $scope.dzOptions2 = {
        url : '/uploadfile.php',
        paramName : 'photo',
        maxFilesize : '10',
        acceptedFiles : 'images/jpeg, images/jpg, image/png, audios/mp3',
        addRemoveLinks : true,      
    };
    
    
    //Handle events for dropzone
    //Visit http://www.dropzonejs.com/#events for more events
    $scope.dzCallbacks = {
        'addedfile' : function(file){
            console.log(file);
            $scope.newFile = file;
        },
        'success' : function(file, xhr){
            console.log(file, xhr);
        },
      
    };
    
    
    //Apply methods for dropzone
    //Visit http://www.dropzonejs.com/#dropzone-methods for more methods
    $scope.dzMethods = {};
    $scope.removeNewFile = function(){
        $scope.dzMethods.removeFile($scope.newFile); //We got $scope.newFile from 'addedfile' event callback
    }
});
*/