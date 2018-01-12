<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;


class WelcomeController extends Controller
{
    //
    public function testmodelview(){
        $subjects = DB::select('select * from subject');
        print_r($subjects);
    }

    public function testajaxview(){
        $subjects = DB::select('select * from subject');
        $out["records"] = $subjects;
    	return response()->json($out);
    }

    public function testview(){
    	$v_data = array("name"=>"asjdflajfl", "code"=>"003");
    	return view("test", $v_data);
    }

    public function test(){
    	return $_SERVER;
    } 

    public function save(){
        $v_data = array("name"=>"asjdflajfl", "code"=>"003");
        return Welcome::save($v_data);
    }

}
