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

Route::get('/user/getusers', 'UserController@getusers');

Route::post('/user/login', 'UserController@login');

Route::post('/user/register', 'UserController@register');

Route::post('/user/update', 'UserController@update');

Route::get('/user/delete/{id}', 'UserController@delete');

Route::get('/problem/getproblems', 'ProblemController@getproblems');

Route::get('/problem/{id}', 'ProblemController@getproblem');

Route::get('/problem/getproblem/{id}', 'ProblemController@getproblem');

Route::post('/problem/insert', 'ProblemController@insert');

Route::post('/problem/update', 'ProblemController@update');

Route::get('/problem/delete/{id}', 'ProblemController@delete');

Route::post('/answer/insert', 'AnswerController@insert');

Route::get('/answer/getlist', 'AnswerController@getlist');

Route::get('/answer/delete/{id}', 'AnswerController@delete');