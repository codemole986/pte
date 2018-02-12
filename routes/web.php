<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/{any?}', function () {
    return view('index');
});

Route::get('/welcome/test', 'WelcomeController@test');

Route::get('/welcome/testview', 'WelcomeController@testview');

Route::get('/welcome/testmodelview', 'WelcomeController@testmodelview');

Route::get('/welcome/testajaxview', 'WelcomeController@testajaxview');

Route::get('/user/getuserlist', 'UserController@getuserlist');

Route::get('/user/getusers', 'UserController@getusers');

Route::post('/user/login', 'UserController@login');

Route::post('/user/register', 'UserController@register');

Route::post('/user/update', 'UserController@update');

Route::get('/user/initpassword/{id}', 'UserController@initpassword');

Route::get('/user/delete/{id}', 'UserController@delete');

Route::get('/problem/getproblems', 'ProblemController@getproblems');

Route::get('/problem/{id}', 'ProblemController@getproblem');

Route::get('/problem/getproblem/{id}', 'ProblemController@getproblem');

Route::get('/problem/getnextproblemid/{id}', 'ProblemController@getnextproblemid');

Route::get('/problem/getprevproblemid/{id}', 'ProblemController@getprevproblemid');

Route::post('/problem/insert', 'ProblemController@insert');

Route::post('/problem/update', 'ProblemController@update');

Route::get('/problem/delete/{id}', 'ProblemController@delete');

Route::post('/problem/uploadfile', 'ProblemController@uploadfile');

Route::post('/answer/insert', 'AnswerController@insert');

Route::post('/answer/updatemarks', 'AnswerController@updatemarks');

Route::get('/answer/getlist', 'AnswerController@getlist');

Route::get('/answer/getexerciseanswers', 'AnswerController@getexerciseanswers');

Route::get('/answer/delete/{id}', 'AnswerController@delete');

Route::get('/answer/getanswer/{testevent_id}/{quiz_id}', 'AnswerController@getanswer');

Route::post('/answer/uploadaudio', 'AnswerController@uploadfile');

Route::post('/answer/updateanseraudio', 'AnswerController@updateanseraudio');

Route::get('/test/getlist', 'TestController@getlist');

Route::get('/test/getcustomlist', 'TestController@getcustomlist');

Route::get('/test/getsimpletesteventlist', 'TestController@getsimpletesteventlist');

Route::post('/test/save', 'TestController@save');

Route::get('/test/delete/{id}', 'TestController@delete');

Route::get('/test/generatetestevent/{test_id}', 'TestController@generatetestevent');

Route::get('/test/gettestevent/{test_id}', 'TestController@gettesteventinfo');

Route::get('/test/gettesteventrow/{id}', 'TestController@gettesteventrow');

Route::get('/test/updateteststatus/{id}', 'TestController@updatetesteventteststaus');

Route::post('/test/updatetesteventmarks/{id}', 'TestController@updatetesteventmarks');

Route::get('/test/update2evalstatus/{id}', 'TestController@update2evalstatus');

Route::get('/test/gettesteventlist', 'TestController@gettesteventlist');

Route::get('/test/eventdelete/{id}', 'TestController@eventdelete');
