<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;

use Validator;


class TestController extends Controller
{
    //
    function getlist(Request $request) {
    	$page_num = $request->_page;
    	$limit_count = $request->_limit;
    	$offset = ($page_num - 1) * $limit_count;
    	$userinfo = $request->session()->get('userinfo');
    	if($userinfo->permission == 'A') {
    		$countresult = DB::select("SELECT count(*) AS count FROM quiz_test");
			$arrTest = DB::select("SELECT * FROM quiz_test ORDER BY created_at DESC LIMIT $offset, $limit_count ");			
    	} else { //$userinfo->permission == 'D'
    		$countresult = DB::select("SELECT count(*) AS count FROM quiz_test WHERE status=1 AND testclass='".$userinfo->class."'");
			$arrTest = DB::select("SELECT * FROM quiz_test WHERE status=1 AND testclass='".$userinfo->class."' ORDER BY created_at DESC LIMIT $offset, $limit_count ");			
    	}

    	//$arrTest = DB::paginate()
		foreach ($arrTest as $key => $test) {
			$arrTest[$key]->preset = json_decode($test->preset);			
		}

		$out_data["total"] = $countresult[0]->count;
		$out_data["data"] = $arrTest;
		return response()->json($out_data);
	}


	// use in dashboeard 
	function getcustomlist(Request $request) {
		$userinfo = $request->session()->get('userinfo');
		if($userinfo != null) {
			if($userinfo->permission == 'A') {
				$arrTest = DB::select("SELECT id, testname, testclass, testdegree, totalmarks, limit_time, count FROM quiz_test WHERE status=1 ORDER BY created_at DESC LIMIT 0, 5");
			} else {
				$arrTest = DB::select("SELECT id, testname, testclass, testdegree, totalmarks, limit_time, count FROM quiz_test WHERE status=1 AND testclass='". $userinfo->class ."' ORDER BY created_at DESC LIMIT 0, 5");	
			}
			return response()->json($arrTest);	
		} else {
			return response()->json(array());
		}
		
	}


	function save(Request $request){
		$test_data = $request->all();
		$userinfo = $request->session()->get('userinfo');
		$test_data["uid"] = $userinfo->id;
		$test_data["preset"] = json_encode($test_data["preset"]);
		$rules = array(
			'testname'=> 'required',
			'testclass'=> 'required',
			'testdegree'=> 'required',
			'totalmarks'=> 'required',
			'limit_time'=> 'required',
			'count'=> 'required',
			'uid'=> 'required',
			'status'=> 'required'
		);
		$validator = Validator::make($test_data, $rules);
		$out_data = array();
		if ($validator->passes()) {			
			if(isset($test_data["id"])) {
				$test_data["updated_at"] = date("Y-m-d H:i:s");
				if(DB::table('quiz_test')
					->where('id', $test_data["id"])
	            	->update($test_data)) {
					$out_data["state"] = "success";
					$out_data["message"] = "update success.";
				} else {
					$out_data["state"] = "error";				
					$out_data["message"] = "update fail.";
				}
			} else {
				$test_data["created_at"] = date("Y-m-d H:i:s");	
				if(DB::table('quiz_test')->insert($test_data)) {
					$out_data["state"] = "success";
					$out_data["message"] = "Insert success.";
				} else {
					$out_data["state"] = "error";				
					$out_data["message"] = "Insert fail.";
				}
			}
		} else {
			$out_data["state"] = "error";				
			$out_data["message"] = "Validation Fail.";
		}
		return response()->json($out_data, 200);
	}


	function delete($id){
		//get event_id list
		$eventid_list = DB::table('quiz_testevent')
					->where(array('test_id'=>$id))
					->get(array("id"));

		$arr_eventids = array();
		foreach ($eventid_list as $key => $value) {
			$arr_eventids[] = $value->id;
		}

		// get answer_count
		$answer_rowcount = DB::table('quiz_answer')
					->whereIn("testevent_id", $arr_eventids)
					->count();
		if($answer_rowcount > 0) {
			$out_data["state"] = "error";				
			$out_data["message"] = "Can't delete test because it has answer history.";
		} else {
			if(DB::table('quiz_test')
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

	
	function getRow( $id ) {	
		$rowdata = DB::select("SELECT * FROM quiz_test WHERE id=$id");
		if($rowdata!=null){			
			return $rowdata[0];
		} else {
			return null;
		}
	}


	function generatetestevent( Request $request, $test_id ) {
		$test_data = $this->getRow($test_id);
		$arr_preset = json_decode($test_data->preset)->__zone_symbol__value;
		$problem_list = array();
		$problem_num = 0;
		foreach ($arr_preset as $key => $preset) {
			# code...
			for($n=0; $n<$preset->count; $n++) {
				$problem_num++;
				$problem_rowcount = DB::table('quiz_problems')
					->where(array('type'=>$preset->type, 'degree'=>$preset->degree))
					->count();

				if($preset->count <= $problem_rowcount ) {
					do {
						$problem_id = DB::table('quiz_problems')
							->where(array('type'=>$preset->type, 'degree'=>$preset->degree))
							->limit(1)
							->offset(rand(0, $problem_rowcount - 1))
							->get(array("id"));
					} while(in_array($problem_id[0]->id, array_values($problem_list)));
				} else {
					$problem_id = DB::table('quiz_problems')
						->where(array('type'=>$preset->type, 'degree'=>$preset->degree))
						->limit(1)
						->offset(rand(0, $problem_rowcount - 1))
						->get(array("id"));
				}

				if( count($problem_id) > 0) {
					$problem_list[$problem_num] = $problem_id[0]->id;		
				} 				
			}			
		}

		$testevent_data = array();
		$userinfo = $request->session()->get('userinfo');
		$testevent_data["start_at"] = date("Y-m-d H:i:s");	
		$testevent_data["uid"] = $userinfo->id;
		$testevent_data["test_id"] = $test_id;
		$testevent_data["problem_list"] = json_encode($problem_list);
		$testevent_data["created_at"] = $testevent_data["start_at"];
		$testevent_data["test_status"] = 0;
		$testevent_data["evaluate_status"] = 0;
		$testevent_data["marks"] = 0;
		$event_id = DB::table('quiz_testevent')->insertGetId($testevent_data);
		return $event_id;
	}

	function gettesteventinfo(Request $request, $test_id) {
		$userinfo = $request->session()->get('userinfo');
		$event_info = DB::table('quiz_testevent')
					->where(array('test_id'=>$test_id, 'uid'=>$userinfo->id, 'test_status'=>0))
					->limit(1)
					->offset(0)
					->get(array("*"));

		return response()->json($event_info, 200);
	}

	function gettesteventrow($id) {
		$event_info = DB::table('quiz_testevent')
					->leftJoin('quiz_test', array('quiz_testevent.test_id'=>'quiz_test.id'))
					->where('quiz_testevent.id',$id)
					->get(array("*"));
		foreach ($event_info as $key => $row) {
			$event_info[$key]->problem_list = json_decode($row->problem_list);
			$event_info[$key]->preset = json_decode($row->preset);
		}
		return response()->json($event_info, 200);		
	}


	// use in dashboeard 
	function getsimpletesteventlist(Request $request) {
		$userinfo = $request->session()->get('userinfo');
		if($userinfo != null) {
			$event_info = DB::table('quiz_testevent')
						->leftJoin('quiz_test', array('quiz_testevent.test_id'=>'quiz_test.id'))
						->where(array('quiz_testevent.uid'=>$userinfo->id, 'quiz_testevent.test_status'=>1))
						->whereNull('testname', 'and', true)
						->orderBy('quiz_testevent.created_at', 'desc')
						->limit(5)
						->offset(0)
						->get(array("*"));

			return response()->json($event_info, 200);		
		} else {
			return response()->json(array(), 200);
		}
	}

	function gettesteventlist(Request $request) {
		$userinfo = $request->session()->get('userinfo');
		$page_num = $request->_page;
    	$limit_count = $request->_limit;
    	$fieldnames = array('quiz_testevent.*', 'quiz_test.testname', 'quiz_test.testclass', 'quiz_test.testdegree', 'quiz_test.count', 'quiz_test.limit_time', 'quiz_test.totalmarks', 'users.email', 'cusers.email AS checker_email');
    	$event_info = array();

		if($userinfo->permission == 'D') {
			$event_info = DB::table('quiz_testevent')
					->leftJoin('quiz_test', array('quiz_testevent.test_id'=>'quiz_test.id'))
					->leftJoin('users', array('quiz_testevent.uid'=>'users.id'))
					->leftJoin('users AS cusers', array('quiz_testevent.evaluator_id'=>'cusers.id'))
					->addSelect($fieldnames)
					->where(array('quiz_testevent.uid'=>$userinfo->id))
					->whereNull('testname', 'and', true)
					->orderBy('quiz_testevent.test_status')
					->orderBy('quiz_testevent.evaluate_status')
					->orderBy('quiz_testevent.created_at', 'desc')
					->paginate($limit_count, ['*'], 'page', $page_num);
		} else if($userinfo->permission == 'C') {
			$event_info = DB::table('quiz_testevent')
					->leftJoin('quiz_test', array('quiz_testevent.test_id'=>'quiz_test.id'))
					->leftJoin('users', array('quiz_testevent.uid'=>'users.id'))
					->leftJoin('users AS cusers', array('quiz_testevent.evaluator_id'=>'cusers.id'))
					->addSelect($fieldnames)
					->where(array('quiz_test.testclass'=>$userinfo->class, 'quiz_testevent.evaluator_id'=>$userinfo->id, 'quiz_testevent.test_status'=>1))
					->where('quiz_testevent.evaluate_status', '!=', 0) 
					->whereNull('testname', 'and', true)
					->orderBy('quiz_testevent.evaluate_status')
					->orderBy('quiz_testevent.created_at', 'desc')
					->paginate($limit_count, ['*'], 'page', $page_num);
		} else if($userinfo->permission == 'B') {
			$event_info = DB::table('quiz_testevent')
					->leftJoin('quiz_test', array('quiz_testevent.test_id'=>'quiz_test.id'))
					->leftJoin('users', array('quiz_testevent.uid'=>'users.id'))
					->leftJoin('users AS cusers', array('quiz_testevent.evaluator_id'=>'cusers.id'))
					->addSelect($fieldnames)
					->where(array('quiz_test.testclass'=>$userinfo->class, 'quiz_testevent.test_status'=>1))					
					->whereNull('testname', 'and', true)
					->orderBy('quiz_testevent.evaluate_status')
					->orderBy('quiz_testevent.created_at', 'desc')
					->paginate($limit_count, ['*'], 'page', $page_num);
		} else if($userinfo->permission == 'A') {
			$event_info = DB::table('quiz_testevent')			
					->leftJoin('quiz_test', array('quiz_testevent.test_id'=>'quiz_test.id'))
					->leftJoin('users', array('quiz_testevent.uid'=>'users.id'))
					->leftJoin('users AS cusers', array('quiz_testevent.evaluator_id'=>'cusers.id'))
					->addSelect($fieldnames)
					->whereNull('testname', 'and', true)
					->orderBy('quiz_testevent.created_at', 'desc')
					->paginate($limit_count, ['*'], 'page', $page_num);
		}
		
		if(count($event_info) > 0) {
			foreach ($event_info as $key => $row) {
				if($row->uid == 0) {
					$event_info[$key]->email = "admin@quiz.com";		
				}
			}	
		} else {
			$event_info = array('data'=>array());
		}

		return response()->json($event_info, 200);		
	}

	function updatetesteventteststaus($id) {
		$test_status["test_status"] = 1;
		if(DB::table('quiz_testevent')
			->where('id', $id)
	        ->update($test_status)) {
			$out_data["state"] = "success";
			$out_data["message"] = "update success.";
		} else {
			$out_data["state"] = "error";				
			$out_data["message"] = "update fail.";
		}
		return response()->json($out_data, 200);
	}

	function updatetesteventmarks(Request $request, $id) {
		$testevent_info = $request->all();
		$testevent_data["marks"] = $testevent_info["marks"];
		$testevent_data["test_status"] = 1;
		$testevent_data["end_at"] = date("Y-m-d H:i:s");
		if(DB::table('quiz_testevent')
			->where('id', $id)
	        ->update($testevent_data)) {
			$out_data["state"] = "success";
			$out_data["message"] = "update success.";
		} else {
			$out_data["state"] = "error";				
			$out_data["message"] = "update fail.";
		}
		return response()->json($out_data, 200);
	}

	function updatetesteventevalmarks(Request $request, $id) {
		$testevent_info = $request->all();
		$testevent_data["marks"] = $testevent_info["marks"];
		$testevent_data["evaluate_status"] = $testevent_info["evaluate_status"];
		$testevent_data["evalend_at"] = date("Y-m-d H:i:s");
		if(DB::table('quiz_testevent')
			->where('id', $id)
	        ->update($testevent_data)) {
			$out_data["state"] = "success";
			$out_data["message"] = "update success.";
		} else {
			$out_data["state"] = "error";				
			$out_data["message"] = "update fail.";
		}
		return response()->json($out_data, 200);
	}

	
	function eventdelete($id){
		//delete answer list and delete event row
		if(DB::table('quiz_answer')
			->where('testevent_id', $id)
	        ->delete() ) {

			if(DB::table('quiz_testevent')
				->where('id', $id)
	        	->delete()) {
				$out_data["state"] = "success";
				$out_data["message"] = "delete success.";
			} else {
				$out_data["state"] = "error";				
				$out_data["message"] = "delete fail.";
			}
		} else {
			$out_data["state"] = "error";				
			$out_data["message"] = "answer delete fail.";
		}
		
		return response()->json($out_data, 200);
	}

	function update2evalstatus($id) {
		$evaluate_status = array();
		$start_at = DB::table('quiz_testevent')
					->where('id', $id)
					->get(array("evalstart_at"));
		if($start_at == null) {
			$evaluate_status["evalstart_at"] = date("Y-m-d H:i:s");			
		}
		$evaluate_status["evaluate_status"] = 2;

		if(DB::table('quiz_testevent')
			->where('id', $id)
	        ->update($evaluate_status)) {
			$out_data["state"] = "success";
			$out_data["message"] = "update success.";
		} else {
			$out_data["state"] = "error";				
			$out_data["message"] = "update fail.";
		}
		return response()->json($out_data, 200);
	}
	
}
