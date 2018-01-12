<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;

use Validator;

class AnswerController extends Controller
{
    function getlist() {
		$answers = DB::select("SELECT 
			a.*, b.category, b.type, b.degree, b.title, b.content, b.solution, c.email 
			FROM quiz_answer a LEFT JOIN quiz_problems b ON a.quiz_id=b.id LEFT JOIN users c ON a.uid=c.id
			ORDER BY a.evaluate_mark, a.end_time DESC");
		foreach ($answers as $key => $answer) {
			$answers[$key]->content = json_decode($answer->content);
			$answers[$key]->answer = json_decode($answer->answer);
			$answers[$key]->solution = json_decode($answer->solution);
		}
		return response()->json($answers, 200);
	}

    function insert(Request $request){
		$answer_data = $request->all();
		$userinfo = $request->session()->get('userinfo');
		$answer_data["uid"] = $userinfo->id;
		$answer_data["status"] = "1";
		$answer_data["answer"] = json_encode($answer_data["answer"]);
		$answer_data["end_time"] = date("Y-m-d H:i:s");
		$answer_data["created_at"] = date("Y-m-d H:i:s");

		unset($answer_data["type"]);

		$rules = array(
			'quiz_id'=> 'required',			
			'uid'=> 'required',
			'status'=> 'required'
		);
		$validator = Validator::make($answer_data, $rules);
		
		$out_data = array();	
		if ($validator->passes()) {
			if(DB::table('quiz_answer')->insert($answer_data)) {
				$out_data["state"] = "success";
				$out_data["message"] = "Insert success.";
			} else {
				$out_data["state"] = "error";				
				$out_data["message"] = "Insert fail.";
			}
		} else {
			$out_data["state"] = "error";				
			$out_data["message"] = "Validation Fail.";
		}	
		return response()->json($out_data, 200);
	}

	function delete($id){
		if(DB::table('quiz_answer')
			->where('id', $id)
        	->delete()) {
			$out_data["state"] = "success";
			$out_data["message"] = "delete success.";
		} else {
			$out_data["state"] = "error";				
			$out_data["message"] = "delete fail.";
		}
			
		return response()->json($out_data, 200);
	}
}
