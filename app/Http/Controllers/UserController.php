<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

use Illuminate\Http\Request;

use App\User;
use App\Http\Controllers\Controller;
use App\Notifications\SendActivationEmail;


use DB;

use Mail;

use Validator;

use Exception;

class UserController extends Controller
{
    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';

    function getusersimplelist(Request $request) {
    	$permission = isset($request->permission)?$request->permission:'D';
    	if($permission == 'D') {
    		$userlist = DB::select("SELECT users.id, users.first_name, users.last_name, users.visited_count, count(quiz_answer.id) AS anscount, avg(quiz_answer.evaluate_mark) AS avgmark
    			FROM users LEFT JOIN quiz_answer ON users.id=quiz_answer.uid 
    			WHERE users.permission = 'D'
    			GROUP BY users.id, users.first_name, users.last_name, users.visited_count
    			ORDER BY users.visited_count DESC 
    			LIMIT 5");
    		

    	} else if($permission == 'B') {
    		$userlist = DB::select("SELECT users.id, users.first_name, users.last_name, users.visited_count, count(quiz_problems.id) AS problemcount, sum(IF(quiz_problems.status=1, 1, 0)) AS passcount
    			FROM users LEFT JOIN quiz_problems ON users.id=quiz_problems.uid 
    			WHERE users.permission = 'B' AND quiz_problems.status=1
    			GROUP BY users.id, users.first_name, users.last_name, users.visited_count
    			ORDER BY users.visited_count DESC 
    			LIMIT 5");
    		foreach ($userlist as $key => $user) {
				# code...
				$userlist[$key]->passrate = $user->problemcount>0?sprintf("%0.1f", $user->passcount/$user->problemcount*100):0;
			}
    	}

    	$out_data["data"] = $userlist;
		return response()->json($out_data);
    }
    
    function getuserlist(Request $request) {
    	$offset = isset($request->start) ? intval($request->start) : 0;
		$limit_count = isset($request->length) ? intval($request->length) : 10;	
		$draw = isset($request->draw) ?intval($request->draw) : 0;

		$useremail = isset($request->useremail) ? $request->useremail : "";
		$permission = isset($request->permission) ? $request->permission : "";

    	$strquery = DB::table('users');
    	$user_totalcount = $strquery->count();
    	if(!empty($useremail)) {
    		$strquery->where("email", 'like',  "%".$useremail."%");
    	}
    	if(!empty($permission)) {
    		$strquery->where("permission", $permission);
    	}
    	$user_filteredcount = $strquery->count();
    	$userlist = $strquery->orderByDesc('created_at')
					->limit($limit_count)
					->offset($offset)
					->get(array("*"));
    	
		$out_data["recordsTotal"] = $user_totalcount;
		$out_data["recordsFiltered"] = $user_filteredcount;
		$out_data["data"] = $userlist;
		$out_data["draw"] = $draw;
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

	/**
     * Validate the user login request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    /*protected function validateLogin(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|string',
            'password' => 'required|string',
        ]);
    }*/

	function login(Request $request){
		//$this->validateLogin($request);

		$email = isset($request->email)?$request->email:'';
		$password = $request->password;

		$out_data = array();
		if(!empty($email)) {
			//
			$userinfo = DB::table('users')
					//->addSelect(array("users.*, profiles.photo"))
					->leftJoin('profiles', array('users.id'=>'profiles.user_id'))
					->where('email', $email)
					->get(array('users.*', 'profiles.photo'));

			if($userinfo!=null && count($userinfo)>0) {
				if($userinfo[0]->permission == 'E') {
					$out_data["state"] = "error";
					$out_data["userinfo"] = "";
					$out_data["message"] = "Please wait for admin's accept...";
				} else if($userinfo[0]->password == md5($password)) {
					$out_data["state"] = "success";
					$out_data["userinfo"] = $userinfo[0];	
					DB::table('users')
						->where('email', $email)
						->increment("visited_count");

					//$request->session()->regenerate();							
					$request->session()->start();
					$out_data["_token"] = csrf_token();	
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

		return response()->json($out_data, 200);
	}

	/**
     * Logout, Clear Session, and Return.
     *
     * @return void
     */
    public function logout(Request $request)
    {
        //Session::flush();
    	$request->session()->forget('userinfo');    	
        $out_data["state"] = "success";
		return response()->json($out_data, 200);		
        //return redirect(property_exists($this, 'redirectAfterLogout') ? $this->redirectAfterLogout : '/');
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
			} 
		} catch (Exception $e) {
            $out_data["state"] = "error";				
			$out_data["message"] = "init password fail.";
        }
		return response()->json($out_data, 200);
	}

	function resetpassword(Request $request){
		
		$user_data["email"] = isset($request->email)?$request->email:'';
		$user_data["password"] = isset($request->password)?$request->password:'123456789';

		$rules = array(
				'email'                 => 'required|email|max:255',
                'password'              => 'required|min:6|max:20',                
		);

		$validator_errors = array(
			'email.required'                => trans('auth.emailRequired'),
            'email.email'                   => trans('auth.emailInvalid'),
            'password.required'             => trans('auth.passwordRequired'),
            'password.min'                  => trans('auth.PasswordMin'),
            'password.max'                  => trans('auth.PasswordMax'),            
			);

		$validator = Validator::make($user_data, $rules, $validator_errors);

		$out_data = array();
		if ($validator->fails()) {
			$out_data["state"] = "error";
			$out_data["message"] = $validator->errors()->first(); //"That email address is already registered.";				
		} else {
			try {
				$user_rowcount = DB::table('users')
					->where('email', $user_data["email"])
					->count();
				if($user_rowcount > 0) {
					$email = $user_data["email"];
					unset($user_data["email"]);				
					if(DB::table('users')
						->where('email', $email)
			        	->update( array( "password"=>md5($user_data["password"]) ) )) {
						$out_data["state"] = "success";
						$out_data["message"] = "password is reseted.";
					}
				} else {
					$out_data["state"] = "error";
					$out_data["message"] = "Your email invalid.";
				}
			} catch (Exception $e) {
	            $out_data["state"] = "error";				
				$out_data["message"] = "Reset password fail.";
	        } 
			
		}
		return response()->json($out_data, 200);
	}

	function changepassword(Request $request){
		$userinfo = $request->session()->get('userinfo');
		$old_password = isset($request->oldpassword)?md5($request->oldpassword):'';
		$user_data["password"] = isset($request->password)?$request->password:'';

		$rules = array(
			'password'              => 'required|min:6|max:20',                
		);

		$validator_errors = array(
			'password.required'             => trans('auth.passwordRequired'),
            'password.min'                  => trans('auth.PasswordMin'),
            'password.max'                  => trans('auth.PasswordMax'),            
		);

		$validator = Validator::make($user_data, $rules, $validator_errors);

		$out_data = array();
		if ($validator->fails()) {
			$out_data["state"] = "error";
			$out_data["message"] = $validator->errors()->first(); //"That email address is already registered.";				
		} else {
			try {
				$user_rowcount = DB::table('users')
					->where(array('id'=>$userinfo->id, "password"=>$old_password))
					->count();
				if($user_rowcount > 0) {
					if(DB::table('users')
						->where(array('id'=>$userinfo->id, "password"=>$old_password))
			        	->update( array( "password"=>md5($user_data["password"]) ) )) {
						$out_data["state"] = "success";
						$out_data["message"] = "Your Password is changed.";
					}
				} else {
					$out_data["state"] = "error";
					$out_data["message"] = "Your Current Password invalid.";
				}
			} catch (Exception $e) {
	            $out_data["state"] = "error";				
				$out_data["message"] = "Change Password Fail.";
	        } 
			
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
		$user_data["first_name"] = isset($request->first_name)?$request->first_name:'';
		$user_data["last_name"] = isset($request->last_name)?$request->last_name:'';
		$user_data["email"] = isset($request->email)?$request->email:'';
		$user_data["password"] = isset($request->password)?$request->password:'aaa';			
		$user_data["address"] = isset($request->address)?$request->address:'';
		$user_data["permission"] = isset($request->permission)?$request->permission:'E';
		$user_data["class"] = isset($request->class)?$request->class:'Basic';
		$user_data['verification_code'] = str_random(20);

		$rules = array(
				'first_name'            => '',
                'last_name'             => '',
                'email'                 => 'required|email|max:255|unique:users',
                'password'              => 'required|min:6|max:20',                
		);

		$validator_errors = array(
			'first_name.required'           => trans('auth.fNameRequired'),
            'last_name.required'            => trans('auth.lNameRequired'),
            'email.required'                => trans('auth.emailRequired'),
            'email.email'                   => trans('auth.emailInvalid'),
            'password.required'             => trans('auth.passwordRequired'),
            'password.min'                  => trans('auth.PasswordMin'),
            'password.max'                  => trans('auth.PasswordMax'),            
			);

		$validator = Validator::make($user_data, $rules, $validator_errors);

		$out_data = array();
		if(!empty($user_data["email"])) {
			if ($validator->fails()) {
				$out_data["state"] = "error";
				$out_data["message"] = $validator->errors()->first(); //"That email address is already registered.";				
			} else {
				$rules_code = array(
					'verification_code' => 'unique:users,verification_code'			
				);
				$validator_code = Validator::make($user_data, $rules_code);

				while($validator_code->fails()) {
					$user_data['verification_code'] = str_random(20);
				}

			    // Register the new user or whatever.			    
				try {

					$user = User::create([
		                'address'           => $user_data['address'],
		                'first_name'        => $user_data['first_name'],
		                'last_name'         => $user_data['last_name'],
		                'email'             => $user_data['email'],
		                'password'          => md5($user_data['password']),
		                'verification_code' => $user_data['verification_code'],
		                'visited_count'	    => 0,    
		                'permission'		=> 'E',        
		            ]);

		            //$user->notify(new SendActivationEmail($user_data['verification_code']));

					/*if(DB::table('users')->insert($user_data)) {
						$data = [
						    'verification_code' => $user_data['verification_code'],
						    'name' => $user_data['name'],
						    'email' => $user_data['email'],
						];
						try {
							Mail::send('emails.welcome', $data, function($message) use ($data)
					        {
					            $message->from('no-reply@quiz.com', "Quiz");
					            $message->subject("Welcome to Quiz");
					            $message->to($data['email']);
					        });
					    } catch ( Exception $e) {
					    	$this->rollBack();
					        throw $e;
					    }
					}*/

				    $out_data["state"] = "success";
					$out_data["message"] = "Register Success.";
					$out_data["name"] = $user_data['email'];
					$out_data["code"] = $user_data['verification_code'];
					
				} catch (Exception $e) {
	                $out_data["state"] = "error";				
					//$out_data["message"] = "(exception) Register Fail.".$e;
					$out_data["message"] = "(exception) Register Fail.";
	            } catch (Throwable $e) {
	                $this->rollBack();

	                throw $e;
	            }
			}
		}

		return response()->json($out_data, 200);
	}

	function sendverifymail() {
		$data = [
		    'verification_code' => 'ffasf',
		    'name' => 'aaaa',
		    'email' => 'aaa@quiz.com',
		];
		try {
			/*Mail::send('emails.welcome', $data, function($message) use ($data)
	        {
	            $message->from('no-reply@quiz.com', "Quiz");
	            $message->subject("Welcome to Quiz");
	            $message->to($data['email']);
	        });*/
	    } catch ( Exception $e) {
	    	$this->rollBack();
	        throw $e;
	    }

        return view('emails.welcome', $data);
	}

	function verifyuser($code) {
		$out_data = array();
		$register_rowcount = DB::table('users')
			->where(array('verification_code'=>$code, 'permission'=>'E'))
			->count();
		if($register_rowcount > 0) {
			if(DB::table('users')
				->where('verification_code', $code)
	        	->update(array('permission'=>'D'))) {
				$out_data["state"] = "success";
				$out_data["message"] = "Register Success.";
			} else {
				$out_data["state"] = "error";
				$out_data["message"] = "Your permission update failed. Retry!";
			}
		} else {
			$out_data["state"] = "error";
			$out_data["message"] = "Email Verify Failed.";
		}

		return response()->json($out_data, 200);
	}


	function getuserprofile(Request $request){
		$userinfo = $request->session()->get('userinfo');
		$profileinfo = DB::table('users')
					->leftJoin('profiles', array('users.id'=>'profiles.user_id'))
					->where('users.id',$userinfo->id)
					->get(array("*"));

		$out_data["state"] = "success";
		$out_data["info"] = $profileinfo[0];

		return response()->json($out_data, 200);
	}

	function saveuserprofile(Request $request){
		$userinfo = $request->session()->get('userinfo');
		$profileinfo["user_id"] = $userinfo->id;
		$profileinfo["phone"] = isset($request->phone)?$request->phone:'';
		$profileinfo["interest"] = isset($request->interest)?$request->interest:'';
		$profileinfo["occupation"] = isset($request->occupation)?$request->occupation:'';
		$profileinfo["website_url"] = isset($request->website_url)?$request->website_url:'';
		$profileinfo["summary"] = isset($request->summary)?$request->summary:'';
		
		if(DB::table('profiles')->updateOrInsert(array("user_id"=>$profileinfo["user_id"]), $profileinfo)) {
			$out_data["state"] = "success";
			$out_data["message"] = "";
		} else {
			$out_data["state"] = "error";
			$out_data["message"] = "save profile Failed.";
		}

		return response()->json($out_data, 200);
	}

	function updateuserphoto($uid, $photoname){
		DB::table('profiles')
			->where("user_id", $uid)
			->update(array('photo' => $photoname));
	}

	function RecursiveMkdir($path)
   	{
       	if (!file_exists($path))
       	{
           	$this->RecursiveMkdir(dirname($path));
           	mkdir($path, 0777);
       	}
   	}

	function uploadphotofile(Request $request) {
		$userinfo = $request->session()->get('userinfo');
		$upload_root_path = dirname( __FILE__ ) . DIRECTORY_SEPARATOR ."../../../public/upload";	
		$profile_dir = "profile";
		$fname = "";
	    
	    $upload_dir = $upload_root_path . DIRECTORY_SEPARATOR . $profile_dir . DIRECTORY_SEPARATOR . $userinfo->id;		
		
		if($request->hasFile('file')) {	
			if($request->hasFile('file')) {
				
				if (!file_exists($upload_dir)) {
			       	$this->RecursiveMkdir($upload_dir);
			   	}	
			   	
			   	$file = $request->file('file');
			   	$file->move($upload_dir, $file->getClientOriginalName());
				$fname = $file->getClientOriginalName();

				$this->updateuserphoto($userinfo->id, $fname);

			}	
			$answer = array( 'status' => 'Success', 'filename'=>$fname);    
		} else {
		    $answer = array( 'status' => 'Error', 'message' => 'No Files' );
		}
		
		echo json_encode( $answer );
	}
}
