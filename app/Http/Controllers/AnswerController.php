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

	function getanswer($testevent_id, $quiz_id) {
		$answer_row = DB::table("quiz_answer")
					->where(array('testevent_id'=>$testevent_id, 'quiz_id'=>$quiz_id, 'status'=>0))
					->orderby("created_at", 'desc')
					->offset(0)
					->limit(1)
					->get(array("*"));
		if( count($answer_row) > 0 ){
			foreach ($answer_row as $key => $answer) {
				$answer_row[$key]->answer = json_decode($answer->answer);
			}
			return response()->json($answer_row[0], 200);	
		} else {
			return response()->json(null, 200);		
		}
	}

    function insert(Request $request){
		$answer_data = $request->all();
		$userinfo = $request->session()->get('userinfo');
		$answer_data["uid"] = $userinfo->id;
		$answer_data["status"] = "0";
		$answer_data["answer"] = json_encode($answer_data["answer"]);
		$answer_data["end_time"] = date("Y-m-d H:i:s");
		$answer_data["created_at"] = date("Y-m-d H:i:s");

		unset($answer_data["type"]);

		$rules = array(
			'testevent_id'=> 'required',			
			'quiz_id'=> 'required',			
			'uid'=> 'required',
			'status'=> 'required'
		);
		$validator = Validator::make($answer_data, $rules);
		
		$dup_cond = array("testevent_id"=>$answer_data["testevent_id"], "quiz_id"=>$answer_data["quiz_id"], "uid"=>$answer_data["uid"]);
		$out_data = array();	
		if ($validator->passes()) {
			if(DB::table('quiz_answer')->updateOrInsert($dup_cond, $answer_data)) {
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

	function updatemarks(Request $request){
		$answer_data = $request->all();
		$userinfo = $request->session()->get('userinfo');
		$answer_data["evaluator_id"] = $userinfo->id;
		$answer_data["status"] = "0";
		$answer_data["check_time"] = date("Y-m-d H:i:s");
		$answer_data["updated_at"] = date("Y-m-d H:i:s");

		unset($answer_data["type"]);
		unset($answer_data["answer"]);
		unset($answer_data["examine_uptime"]);
		unset($answer_data["start_time"]);
		unset($answer_data["end_time"]);
		unset($answer_data["created_at"]);
		unset($answer_data["id"]);
		unset($answer_data["remember_token"]);
		unset($answer_data["evaluator_id"]);

		$rules = array(
			'testevent_id'=> 'required',			
			'quiz_id'=> 'required',			
			'uid'=> 'required',
			'status'=> 'required'
		);
		$validator = Validator::make($answer_data, $rules);
		
		$dup_cond = array("testevent_id"=>$answer_data["testevent_id"], "quiz_id"=>$answer_data["quiz_id"], "uid"=>$answer_data["uid"]);
		$out_data = array();	
		if ($validator->passes()) {
			if(DB::table('quiz_answer')
				->where($dup_cond)
				->update($answer_data)) {
				$out_data["state"] = "success";
				$out_data["message"] = "Update success.";
			} else {
				$out_data["state"] = "error";				
				$out_data["message"] = "Update fail.";
			}
		} else {
			$out_data["state"] = "error";				
			$out_data["message"] = "Validation Fail.";
		}	
		return response()->json($out_data, 200);
	}

	function RecursiveMkdir($path)
   	{
       	if (!file_exists($path))
       	{
           	$this->RecursiveMkdir(dirname($path));
           	mkdir($path, 0777);
       	}
   	}

	function uploadfile(Request $request) {
		$userinfo = $request->session()->get('userinfo');
		$answer_data = $request->all();
		$data = substr($answer_data['data'], strpos($answer_data['data'], ",") + 1);
		
		$upload_root_path = dirname( __FILE__ ) . DIRECTORY_SEPARATOR ."../../../public/recordings";	
		$answer_dir = "a1";
	    $qid = $answer_data["quizid"];	
	    $tevent_id = $answer_data["testid"];	

	    if($tevent_id == 0) {
	    	$answer_upload_dir = $upload_root_path . DIRECTORY_SEPARATOR . $userinfo->id. DIRECTORY_SEPARATOR . $qid;	
	    } else {
	    	$answer_upload_dir = $upload_root_path . DIRECTORY_SEPARATOR . $tevent_id . DIRECTORY_SEPARATOR . $qid;	
	    }		
		
		if (!file_exists($answer_upload_dir)) {
	       	$this->RecursiveMkdir($answer_upload_dir);
	   	}	
			   	

		/*if($request->hasFile('data')) {	
			if($request->hasFile('data')) {
				foreach ($request->file('data') as $file) {
					$file->move($answer_upload_dir, $file->getClientOriginalName());
				}	
			}					
			$answer = array( 'status' => 'Success');    
		} else {
		    $answer = array( 'status' => 'Error', 'message' => 'No Files' );
		}*/

		$decodedData = base64_decode($data);
		$filename = 'speaking-' . date( 'Y-m-d-H-i-s' ) .'.mp3';
		// write the data out to the file
		$fp = fopen($answer_upload_dir . DIRECTORY_SEPARATOR . $filename, 'wb');
		fwrite($fp, $decodedData);
		fclose($fp);
		$answer = array( 'status' => 'Success', 'filename'=>$filename);    

		
		/*if(DB::table('quiz_answer')
			//->where()			
			->update($update_data)) {
			$out_data["state"] = "success";
			$out_data["message"] = "Update success.";
		} else {
			$out_data["state"] = "error";				
			$out_data["message"] = "Update fail.";
		}*/

		echo json_encode( $answer );
	}

	function updateanseraudio() {

	}
}
