<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\AuthenticatesUsers;

use Illuminate\Http\Request;

use DB;

use Exception;

class UserController extends Controller
{
    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/examinee';


    function getuserlist(Request $request) {
    	$page_num = $request->_page;
    	$limit_count = $request->_limit;
    	$offset = ($page_num - 1) * $limit_count;

    	$user_rowcount= DB::table('users')->count();
    	$userlist = DB::table('users')
    				->orderByDesc('created_at')
					->limit($limit_count)
					->offset($offset)
					->get(array("*"));

		$out_data["total"] = $user_rowcount;
		$out_data["data"] = $userlist;
		return response()->json($out_data);
    }

    //
	function getusers(){

		$users = DB::select("SELECT * FROM users");
		foreach ($users as $key => $user) {
			# code...
			$users[$key]->no = $key+1;
		}
		return response()->json($users, 200);
	}

	function login(Request $request){
		$email = isset($request->email)?$request->email:'';
		$password = $request->password;

		$out_data = array();
		if(!empty($email)) {
			// defaul manager admin@quiz.com/admin
			if($email == "admin@quiz.com" && $password=="admin") {
				$userinfo = json_decode('{
					"id":0,
					"name": "admin",
					"email": "admin@quiz.com",
					"permission": "A",
					"class": "Gold"
				 }');
				$out_data["state"] = "success";
				$out_data["userinfo"] = $userinfo;	
				$request->session()->put('userinfo', $userinfo);
			} else {
				//
				$str_query = sprintf("SELECT * FROM users WHERE `email`='%s'", $email);
				$userinfo = DB::select($str_query);

				if($userinfo!=null && count($userinfo)>0) {
					if($userinfo[0]->permission == 'E') {
						$out_data["state"] = "error";
						$out_data["userinfo"] = "";
						$out_data["message"] = "Invalide Your Permission.";
					} else if($userinfo[0]->password == md5($password)) {
						$out_data["state"] = "success";
						$out_data["userinfo"] = $userinfo[0];	
						$request->session()->put('userinfo', $userinfo[0]);
					} else {
						$out_data["state"] = "error";
						$out_data["userinfo"] = "";
						$out_data["message"] = "Invalide Your Password.";
					}				
				} else {
					$out_data["state"] = "error";
					$out_data["userinfo"] = "";
					$out_data["message"] = "Invalide Your Email.";
				}	
			}
		}

		return response()->json($out_data, 200);
	}

	function update(Request $request){
		$user_data = $request->all();		
		unset($user_data["no"]);
		$out_data = array();
		$user_data["updated_at"] = date("Y-m-d H:i:s");
		if(DB::table('users')
			->where('id', $user_data["id"])
        	->update($user_data)) {
			$out_data["state"] = "success";
			$out_data["message"] = "update success.";
		} else {
			$out_data["state"] = "error";				
			$out_data["message"] = "update fail.";
		}
		return response()->json($out_data, 200);
	}

	function initpassword($id){
		$out_data = array();
		$user_data["password"] = md5("123456789");
		try {
			if(DB::table('users')
				->where('id', $id)
	        	->update($user_data)) {
				$out_data["state"] = "success";
				$out_data["message"] = "password is set '123456789'.";
			} else {
				$out_data["state"] = "error";				
				$out_data["message"] = "init password fail.";
			}
		} catch (Exception $e) {
            $out_data["state"] = "error";				
			$out_data["message"] = "init password fail.";
        } 
		return response()->json($out_data, 200);
	}

	function delete(Request $request, $id ){
		$userinfo = $request->session()->get('userinfo');
		if($id == $userinfo->id) {
			$out_data["state"] = "error";				
			$out_data["message"] = "Can't delete userself.";
			return response()->json($out_data, 200);
		} else {
			$problem_rowcount = DB::table('quiz_problems')
					->where('uid', $id)
					->count();
			if($problem_rowcount > 0) {
				$out_data["state"] = "error";				
				$out_data["message"] = "Can't delete user because he has quiz history.";
				return response()->json($out_data, 200);
			}

			$answer_rowcount = DB::table('quiz_answer')
					->where('uid', $id)
					->orWhere('evaluator_id', $id)
					->count();
			if($answer_rowcount > 0) {
				$out_data["state"] = "error";				
				$out_data["message"] = "Can't delete user because he has answer or check history.";
				return response()->json($out_data, 200);
			}

			$test_rowcount = DB::table('quiz_test')
					->where('uid', $id)
					->count();
			if($test_rowcount > 0) {
				$out_data["state"] = "error";				
				$out_data["message"] = "Can't delete user because he has test history.";
				return response()->json($out_data, 200);
			}
		} 
		if(DB::table('users')
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

	function register(Request $request){
		$user_data["name"] = isset($request->name)?$request->name:'';
		$user_data["email"] = isset($request->email)?$request->email:'';
		$user_data["password"] = isset($request->password)?$request->password:'aaa';
		$user_data["password"] = md5($user_data["password"]);
		$user_data["permission"] = isset($request->permission)?$request->permission:'E';
		$user_data["class"] = isset($request->class)?$request->class:'Basic';

		$out_data = array();
		if(!empty($user_data["name"]) && !empty($user_data["email"])) {
			$user_data["created_at"] = date("Y-m-d H:i:s");
			try {
				if(DB::table('users')->insert($user_data)) {
					$out_data["state"] = "success";
					$out_data["message"] = "Register Success.";
				} else {
					$out_data["state"] = "error";				
					$out_data["message"] = "Register Fail.";
				}	
			} catch (Exception $e) {
                $out_data["state"] = "error";				
				$out_data["message"] = "Register Fail.";
            } catch (Throwable $e) {
                $this->rollBack();

                throw $e;
            }
			
		}

		return response()->json($out_data, 200);
	}
}
