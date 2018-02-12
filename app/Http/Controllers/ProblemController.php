<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\File;
use DB;
use Validator;

class ProblemController extends Controller
{
	function getproblems(Request $request) {
		$page_num = $request->_page;
    	$limit_count = $request->_limit;
		$userinfo = $request->session()->get('userinfo');
		if($userinfo!=null) {
			$fieldnames = array('quiz_problems.*', 'users.email');
			if($userinfo->permission == 'A') {
				$problems = DB::table('quiz_problems')
						->addSelect($fieldnames)
						->leftJoin('users', array('quiz_problems.uid'=>'users.id'))					
						->orderBy('quiz_problems.created_at', 'desc')
						->paginate($limit_count, ['*'], 'page', $page_num);
			} else if($userinfo->permission == 'B') {
				$problems = DB::table('quiz_problems')
						->addSelect($fieldnames)
						->leftJoin('users', array('quiz_problems.uid'=>'users.id'))
						->where('quiz_problems.uid',$userinfo->id)
						->orderBy('quiz_problems.created_at', 'desc')
						->paginate($limit_count, ['*'], 'page', $page_num);	
			} else {
				$problems = DB::table('quiz_problems')
						->addSelect($fieldnames)
						->leftJoin('users', array('quiz_problems.uid'=>'users.id'))
						//->where('quiz_problems.uid',$userinfo->id)
						->orderBy('quiz_problems.created_at', 'desc')
						->paginate($limit_count, ['*'], 'page', $page_num);	
			}
			

			/*$problems = DB::select("SELECT quiz_problems.*, users.email AS maker FROM quiz_problems LEFT JOIN users ON quiz_problems.uid=users.id ORDER BY created_at DESC");*/

			foreach ($problems as $key => $problem) {
				$problems[$key]->content = json_decode($problem->content);
				$problems[$key]->solution = json_decode($problem->solution);
				if($problem->uid == 0) {
					$problems[$key]->email = "admin@quiz.com";
				}
				//$problems[$key]->examine = "";
			}
			return response()->json($problems, 200);	
		} else {
			return redirect('/login');
		}
		
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

	function getnextproblemid($qid) {
		$quiz_info = DB::table('quiz_problems')
					->where('id', $qid)
					->get(array("type", "degree"));

		
		$next_quiz_id = DB::table('quiz_problems')
					//->where(array('type'=>$quiz_info[0]->type, 'degree'=>$quiz_info[0]->degree))
					->where('type', $quiz_info[0]->type)
					->where('id', '>', $qid)
					->min('id');
		$result["id"] = $next_quiz_id;

		$next_quiz_count = DB::table('quiz_problems')
					->where('type', $quiz_info[0]->type)
					->where('id', '>', $qid)
					->count();
		$result["count"] = $next_quiz_count;

		return response()->json($result, 200);
	}

	function getprevproblemid($qid) {
		$quiz_info = DB::table('quiz_problems')
					->where('id', $qid)
					->get(array("type", "degree"));

		
		$prev_quiz_id = DB::table('quiz_problems')
					->where('type', $quiz_info[0]->type)
					->where('id', '<', $qid)
					->max('id');
		$result["id"] = $prev_quiz_id;

		$prev_quiz_count = DB::table('quiz_problems')
					->where('type', $quiz_info[0]->type)
					->where('id', '<', $qid)
					->count();
		$result["count"] = $prev_quiz_count;

		return response()->json($result, 200);
	}

	function getproblemcount( $type="", $degree="" ) {	
		$rowcount= DB::table('quiz_problems')
					->where(array('type'=>$type, 'degree'=>$degree))
					->count();

		return $rowcount;
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
		unset($problem_data["email"]);
		$out_data = array();
		if ($validator->passes()) {
			$qid = DB::table('quiz_problems')->insertGetId($problem_data);
			if($qid!=null) {
				$out_data["state"] = "success";
				$out_data["message"] = "Insert success.";
				$out_data["qid"] = $qid;
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
			unset($problem_data["email"]);
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

	function RecursiveMkdir($path)
   	{
       	if (!file_exists($path))
       	{
           	$this->RecursiveMkdir(dirname($path));
           	mkdir($path, 0777);
       	}
   	}

	function uploadfile(Request $request) {
		$problem_data = $request->all();		
		$upload_root_path = dirname( __FILE__ ) . DIRECTORY_SEPARATOR ."../../../public/upload";	
		$solution_dir = "s0";
	    $answer_dir = "a1";
	    $quiz_dir = "q2";
	    $qid = isset($problem_data["quizid"])?$problem_data["quizid"]:"0";	
	    $type = isset($problem_data["type"])?$problem_data["type"]:"quiz";	

	    if($type=="quiz"){
			$upload_dir = $upload_root_path . DIRECTORY_SEPARATOR . $quiz_dir . DIRECTORY_SEPARATOR . $qid;		
		} else {
			$upload_dir = $upload_root_path . DIRECTORY_SEPARATOR . $solution_dir . DIRECTORY_SEPARATOR . $qid;		
		}

		$quiz_upload_dir = $upload_root_path . DIRECTORY_SEPARATOR . $quiz_dir . DIRECTORY_SEPARATOR . $qid;
		$solution_upload_dir = $upload_root_path . DIRECTORY_SEPARATOR . $solution_dir . DIRECTORY_SEPARATOR . $qid;	
		$count = 0;

		/*if($request->hasFile('qfile') || $request->hasFile('sfile')) {	
			if($request->hasFile('qfile')) {
				if (!file_exists($quiz_upload_dir)) {
			       	$this->RecursiveMkdir($quiz_upload_dir);
			   	}	
			   	foreach ($request->file('qfile') as $file) {
					$file->move($quiz_upload_dir, $file->getClientOriginalName());
					$count++;
				}	
			}	
			if($request->hasFile('sfile')) {
				if (!file_exists($solution_upload_dir)) {
			       	$this->RecursiveMkdir($solution_upload_dir);
			   	}	
			   	foreach ($request->file('sfile') as $file) {
					$file->move($solution_upload_dir, $file->getClientOriginalName());
					$count++;
				}	
			}	
			$answer = array( 'status' => 'Success', 'filecount'=>$count);    
		} */
		if($request->hasFile('file')) {	
			if($request->hasFile('file')) {
				
				if (!file_exists($upload_dir)) {
			       	$this->RecursiveMkdir($upload_dir);
			   	}	
			   	
			   	$file = $request->file('file');
			   	$file->move($upload_dir, $file->getClientOriginalName());
	    		$count++;				
			}	
			$answer = array( 'status' => 'Success', 'filecount'=>$count);    
		} else {
		    $answer = array( 'status' => 'Error', 'message' => 'No Files' );
		}
		
		echo json_encode( $answer );
	}

	
}
