<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\File;
use DB;
use Validator;

class ProblemController extends Controller
{
	function getsimpleproblems(Request $request) {
		$category = isset($request->category)?$request->category:'Writing';
		$cond = isset($request->cond)?$request->cond:'All';

		$fieldnames = array('id','category', 'type', 'title', 'preparation_time', 'limit_time', 'points', 'created_at');
		try {
			if($cond == 'All') {
				$problems = DB::table('quiz_problems')	
						->where('category', $category)				
						->latest()
						->take(5)
						->get($fieldnames);
			} else {
				$userinfo = $request->session()->get('userinfo');
				$problems = DB::table('quiz_problems')	
						->where('category', $category)
						->where('uid', $userinfo->id)				
						->latest()
						->take(5)
						->get($fieldnames);
			}
		} catch (Exception $e) {
            $problems = array();
		}
		
		
		$out_data["data"] = $problems;
		return response()->json($out_data, 200);			
	}

	function getproblems(Request $request) {
		$offset = isset($request->start) ? intval($request->start) : 0;
    	$limit_count = isset($request->length)?intval($request->length):15;
    	$draw = isset($request->draw) ?intval($request->draw) : 0;

    	$quizcategory = isset($request->category) ?$request->category : "";
    	$quiztype = isset($request->type) ?$request->type : "";

    	$page_num = $offset / $limit_count+1;
		$userinfo = $request->session()->get('userinfo');
		if($userinfo!=null) {
			$fieldnames = array('quiz_problems.*', 'users.email');
			if($userinfo->permission == 'A') {
				$strquery = DB::table('quiz_problems')
						->addSelect($fieldnames)
						->leftJoin('users', array('quiz_problems.uid'=>'users.id'));
				if(!empty($quizcategory)){
					$strquery->where("category", $quizcategory);
				}
				if(!empty($quiztype)) {
		    		$strquery->where("quiz_problems.type", $quiztype);
		    	}					
				$problems = $strquery->orderBy('quiz_problems.created_at', 'desc')
						->paginate($limit_count, ['*'], 'page', $page_num);	
						
			} else if($userinfo->permission == 'B') {
				$strquery = DB::table('quiz_problems')
						->addSelect($fieldnames)
						->leftJoin('users', array('quiz_problems.uid'=>'users.id'))
						->where('quiz_problems.uid',$userinfo->id);
				if(!empty($quizcategory)){
					$strquery->where("category", $quizcategory);
				}
				if(!empty($quiztype)) {
		    		$strquery->where("quiz_problems.type", $quiztype);
		    	}					
				$problems = $strquery->orderBy('quiz_problems.created_at', 'desc')
						->paginate($limit_count, ['*'], 'page', $page_num);	
			} else {
				$strquery = DB::table('quiz_problems')
						->addSelect($fieldnames)
						->leftJoin('users', array('quiz_problems.uid'=>'users.id'));						
				if(!empty($quizcategory)){
					$strquery->where("category", $quizcategory);
				}
				if(!empty($quiztype)) {
		    		$strquery->where("quiz_problems.type", $quiztype);
		    	}						
				$problems = $strquery->orderBy('quiz_problems.created_at', 'desc')
						->paginate($limit_count, ['*'], 'page', $page_num);	
			}
			

			foreach ($problems as $key => $problem) {
				$problems[$key]->content = json_decode($problem->content);
				$problems[$key]->solution = json_decode($problem->solution);				
			}

			$records["data"] = $problems->items();
			$records["draw"] = $draw;
			$records["recordsTotal"] = $problems->total();
  			$records["recordsFiltered"] = $problems->total();
			return response()->json($records, 200);

		} else {
			return redirect('/login');
		}
		
	}

	function getproblemswithtype(Request $request) {
		$offset = isset($request->start) ? intval($request->start) : 0;
    	$limit_count = isset($request->length)?intval($request->length):15;
    	$qtype = isset($request->type)?$request->type:"LWS";
    	$draw = isset($request->draw) ?intval($request->draw) : 0;
    	$search = isset($request->search)?$request->search:array("value"=>"");

    	$page_num = $offset / $limit_count + 1;
		$userinfo = $request->session()->get('userinfo');
		if($userinfo!=null) {
			$problems = DB::table('quiz_problems');
			if($userinfo->permission == 'A' || $userinfo->permission == 'B') {
				$str_query = DB::table('quiz_problems')
						->addSelect(array('id', 'title', 'preparation_time', 'limit_time', 'status'))
						->where("type", $qtype);
				if(!empty($search)){
					$str_query->where("title", 'like', "%".$search["value"]."%");
				}
				$problems = $str_query->orderBy('created_at', 'desc')
						->paginate($limit_count, ['*'], 'page', $page_num);	
			} else {
				$str_query = DB::table('quiz_problems')
						->addSelect(array('id', 'title', 'preparation_time', 'limit_time'))						
						->where(array("type"=>$qtype, 'status'=>1));
				if(!empty($search)){
					$str_query->where("title", 'like', "%".$search["value"]."%");
				}

				$problems = $str_query->orderBy('created_at', 'desc')
						->paginate($limit_count, ['*'], 'page', $page_num);	
			} 

			foreach ($problems as $key => $problem) {
				$problems[$key]->no = $offset+$key+1;				
			}

			//return $problems->items();
			$records["data"] = $problems->items();
			$records["draw"] = $request->draw;
			$records["recordsTotal"] = $problems->total();
  			$records["recordsFiltered"] = $problems->total();
			return response()->json($records, 200);
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
			abort(404);
		}
		
	}

	
	function getfullproblem($qid) {	
		$quiz_info = DB::table('quiz_problems')
					->where('id', $qid)
					->get();

		if(count($quiz_info) > 0) {
			$quiz_info[0]->content = json_decode($quiz_info[0]->content);			
			$quiz_info[0]->solution = json_decode($quiz_info[0]->solution);

			$next_quiz_id = DB::table('quiz_problems')
					//->where(array('type'=>$quiz_info[0]->type, 'degree'=>$quiz_info[0]->degree))
					->where('type', $quiz_info[0]->type)
					->where('id', '>', $qid)
					->min('id');
			$result["nextqid"] = $next_quiz_id;

			$prev_quiz_id = DB::table('quiz_problems')
					->where('type', $quiz_info[0]->type)
					->where('id', '<', $qid)
					->max('id');
			$result["prevqid"] = $prev_quiz_id;

			$result["problem"] = $quiz_info[0];
			return response()->json($result, 200);
		} else {
			return response()->json(null, 200);
		}		
	}

	function getfirstproblem($type) {	
		$quiz_info = DB::table('quiz_problems')
					->where('type', $type)
					->get();

		if(count($quiz_info) > 0) {
			$quiz_info[0]->content = json_decode($quiz_info[0]->content);			
			$quiz_info[0]->solution = json_decode($quiz_info[0]->solution);

			$next_quiz_id = DB::table('quiz_problems')
					//->where(array('type'=>$quiz_info[0]->type, 'degree'=>$quiz_info[0]->degree))
					->where('type', $quiz_info[0]->type)
					->where('id', '>', $quiz_info[0]->id)
					->min('id');
			$result["nextqid"] = $next_quiz_id;

			$prev_quiz_id = DB::table('quiz_problems')
					->where('type', $quiz_info[0]->type)
					->where('id', '<', $quiz_info[0]->id)
					->max('id');
			$result["prevqid"] = $prev_quiz_id;

			$result["problem"] = $quiz_info[0];
			return response()->json($result, 200);
		} else {
			return response()->json(null, 200);
		}		
	}

	function getnextproblemid($qid) {
		$quiz_info = DB::table('quiz_problems')
					->where('id', $qid)
					->get(array("type"));

		
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
					->get(array("type"));

		
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
					->where(array('type'=>$type))
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
		//if(isset($problem_data["degree"]))
		unset($problem_data["degree"]);
		$rules = array(
			'category'=> 'required',
			'type'=> 'required',
			//'degree'=> 'required',
			'title'=> 'required',
			'guide'=> 'required',
			'preparation_time'=> 'required',
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

		//if(isset($problem_data["degree"]))
		unset($problem_data["degree"]);

		$rules = array(
			'category'=> 'required',
			'type'=> 'required',
			//'degree'=> 'required',
			'title'=> 'required',
			'guide'=> 'required',
			'preparation_time'=> 'required',
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
		$answer_rowcount = DB::table('quiz_answer')
				->where('quiz_id', $id)
				->count();
		if($answer_rowcount > 0) {
			$out_data["state"] = "error";				
			$out_data["message"] = "Can't delete user because he has answer or check history.";			
		} else {
			if(DB::table('quiz_problems')
				->where('id', $id)
	        	->delete()) {
				$out_data["state"] = "success";
				$out_data["message"] = "delete success.";
			} else {
				$out_data["state"] = "error";				
				$out_data["message"] = "delete fail.";
			}	
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
			   	
			   	if (count($request->file('file')) == 1) {
			   		$file = $request->file('file');
			   		$file->move($upload_dir, $file->getClientOriginalName());
					$count++;
			   	} else {
			   		foreach ($request->file('file') as $file) {
						$file->move($upload_dir, $file->getClientOriginalName());
						$count++;
					}
			   	}
			   	//$file = $request->file('file');
			   	//$file->move($upload_dir, $file->getClientOriginalName());
	    		//$count++;				
			}	
			$answer = array( 'status' => 'Success', 'filecount'=>$count);    
		} else {
		    $answer = array( 'status' => 'Error', 'message' => 'No Files' );
		}
		
		echo json_encode( $answer );
	}

	
}
