<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\AuthenticatesUsers;

use Illuminate\Http\Request;

use DB;

class UserController extends Controller
{
    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/examinee';


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
			$str_query = sprintf("SELECT * FROM users WHERE `email`='%s'", $email);
			$userinfo = DB::select($str_query);

			if($userinfo!=null && count($userinfo)>0) {
				if($userinfo[0]->password == $password) {
					$out_data["state"] = "success";
					$out_data["userinfo"] = $userinfo[0];	
					$request->session()->put('userinfo', $userinfo[0]);
				} else {
					$out_data["state"] = "fail";
					$out_data["userinfo"] = "";
					$out_data["message"] = "Invalide Your Password.";
				}
				
			} else {
				$out_data["state"] = "fail";
				$out_data["userinfo"] = "";
				$out_data["message"] = "Invalide Your Email.";
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

	function delete($id, Request $request){
		$userinfo = $request->session()->get('userinfo');
		if(DB::table('users')
			->where('id', $id)
			->where('name', '!=', $userinfo->name)
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
		$user_data["password"] = isset($request->password)?$request->password:'';
		$user_data["permission"] = isset($request->permission)?$request->permission:'A';

		$out_data = array();
		if(!empty($user_data["name"]) && !empty($user_data["email"])) {
			$user_data["created_at"] = date("Y-m-d H:i:s");
			if(DB::table('users')->insert($user_data)) {
				$out_data["state"] = "success";
				$out_data["message"] = "Register Success.";
			} else {
				$out_data["state"] = "fail";				
				$out_data["message"] = "Register Fail.";
			}
		}

		return response()->json($out_data, 200);
	}
}
