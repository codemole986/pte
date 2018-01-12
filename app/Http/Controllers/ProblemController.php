<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Validator;

class ProblemController extends Controller
{
	function getproblems() {
		$problems = DB::select("SELECT quiz_problems.*, users.email AS maker FROM quiz_problems LEFT JOIN users ON quiz_problems.uid=users.id ORDER BY created_at DESC");
		foreach ($problems as $key => $problem) {
			$problems[$key]->content = json_decode($problem->content);
			$problems[$key]->solution = json_decode($problem->solution);
			$problems[$key]->examine = "";
		}
		return response()->json($problems, 200);
	}

	function getproblem($pn) {	
		$start = $pn - 1;	
		$problem = DB::select("SELECT * FROM quiz_problems WHERE id=$pn");
		if($problem!=null){
			$problem[0]->content = json_decode($problem[0]->content);
			$problem[0]->solution = json_decode($problem[0]->solution);
			return response()->json($problem[0], 200);
		} else {
			return response()->json(null, 200);
		}
		
		/*$fp = fopen("1.txt", "aw+");
		fwrite($fp, $id);
		fwrite($fp, "\n".$problem[0]->category);
		fclose($fp);*/
		
	}

    function insert(Request $request){
		$problem_data = $request->all();
		$userinfo = $request->session()->get('userinfo');
		$problem_data["uid"] = $userinfo->id;
		$problem_data["status"] = "1";
		$problem_data["evaluate_mode"] = "Auto";
		$problem_data["content"] = json_encode($problem_data["content"]);
		$problem_data["solution"] = json_encode($problem_data["solution"]);
		/*$fp = fopen("1.txt", "aw+");
		fwrite($fp, "\n".$problem_data["content"]);
		fwrite($fp, "\n".$problem_data["solution"]);
		fclose($fp);*/
		$rules = array(
			'category'=> 'required',
			'type'=> 'required',
			'degree'=> 'required',
			'title'=> 'required',
			'guide'=> 'required',
			'limit_time'=> 'required',
			'evaluate_mode'=> 'required',
			'points'=> 'required',
			'uid'=> 'required',
			'status'=> 'required'
		);
		$validator = Validator::make($problem_data, $rules);
		$problem_data["created_at"] = date("Y-m-d H:i:s");
		$out_data = array();
		if ($validator->passes()) {
			if(DB::table('quiz_problems')->insert($problem_data)) {
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

	function update(Request $request){
		$problem_data = $request->all();		
		$userinfo = $request->session()->get('userinfo');
		$problem_data["uid"] = $userinfo->id;
		$problem_data["status"] = "1";
		$problem_data["evaluate_mode"] = "Auto";
		$problem_data["content"] = json_encode($problem_data["content"]);
		$problem_data["solution"] = json_encode($problem_data["solution"]);
		$rules = array(
			'category'=> 'required',
			'type'=> 'required',
			'degree'=> 'required',
			'title'=> 'required',
			'guide'=> 'required',
			'limit_time'=> 'required',
			'evaluate_mode'=> 'required',
			'points'=> 'required',
			'uid'=> 'required',
			'status'=> 'required'
		);
		$validator = Validator::make($problem_data, $rules);
		
		$out_data = array();
		if ($validator->passes()) {
			$problem_data["updated_at"] = date("Y-m-d H:i:s");
			unset($problem_data["maker"]);
			if(DB::table('quiz_problems')
				->where('id', $problem_data["id"])
            	->update($problem_data)) {
				$out_data["state"] = "success";
				$out_data["message"] = "update success.";
			} else {
				$out_data["state"] = "error";				
				$out_data["message"] = "update fail.";
			}
		} else {
			$out_data["state"] = "error";				
			$out_data["message"] = "Validation Fail.";
		}		
		return response()->json($out_data, 200);
	}

	function delete($id){
		if(DB::table('quiz_problems')
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
