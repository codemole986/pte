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

    public function getstatisticsdata(Request $request) {
        $out_data = array();
        $userinfo = $request->session()->get('userinfo');
        
        if($userinfo!=null){
            if($userinfo->permission=='D') {
                $visitedcount = DB::table('users')
                        ->where(array('id'=>$userinfo->id))
                        ->get(array("visited_count"));
                $out_data["psvisitedcount"] = $visitedcount[0]->visited_count;

                /*$honourcount = DB::select("SELECT count(*) AS count FROM quiz_answer LEFT JOIN quiz_problems ON quiz_answer.quiz_id = quiz_problems.id WHERE quiz_answer.uid = ".$userinfo->id." AND quiz_answer.evaluate_mark/quiz_problems.points > 0.7");
                if($honourcount!=null && count($honourcount)>0) {
                    $out_data["pshonourcount"] = $honourcount[0]->count;
                } else {
                    $out_data["pshonourcount"] = 0;
                }*/

                $out_data["psexercisecount"] = DB::table('quiz_answer')
                    ->where("uid", $userinfo->id)
                    ->count();

                $out_data["psexquizcount"] = DB::table('quiz_answer')
                    ->where("uid", $userinfo->id)
                    ->groupBy("quiz_id")
                    ->count();
                
                $userrank = DB::select(sprintf("SELECT count(b.cn)+1 AS userrank from (SELECT uid, count(id) AS cn FROM quiz_answer GROUP BY uid) a LEFT JOIN (SELECT uid, count(id) AS cn FROM quiz_answer GROUP BY uid) b ON a.cn < b.cn where a.uid=%d GROUP BY a.uid", $userinfo->id));
                if($userrank!=null && count($userrank)>0) {
                    $out_data["psrank"] = $userrank[0]->userrank;
                } else {
                    $out_data["psrank"] = 0;
                }
                
                // $passcount = DB::select("SELECT count(*) AS count FROM quiz_answer LEFT JOIN quiz_problems ON quiz_answer.quiz_id = quiz_problems.id WHERE quiz_answer.uid = ".$userinfo->id." AND quiz_answer.evaluate_mark/quiz_problems.points > 0.7"); 

                // $out_data["pstotalexercisecount"] = DB::table('quiz_answer')
                //         ->where('quiz_answer.uid', $userinfo->id)
                //         ->count();

                // if($out_data["pstotalexercisecount"]==0){
                //     $out_data["pspassrate"] = 0;
                // } else {
                //     if($passcount!=null && count($passcount)>0) {
                //         $out_data["pspassrate"] = sprintf("%0.1f", $passcount[0]->count/$out_data["pstotalexercisecount"]*100);
                //     } else {
                //         $out_data["pspassrate"] = 0;
                //     }    
                // }
                
            } else if($userinfo->permission=='B') {
                $visitedcount = DB::table('users')
                        ->where(array('id'=>$userinfo->id))
                        ->get(array("visited_count"));
                $out_data["psvisitedcount"] = $visitedcount[0]->visited_count;

                $out_data["psuploadedproblemcount"] = DB::table('quiz_problems')
                    ->where(array('uid'=>$userinfo->id))
                    ->count();   

                $out_data["psacceptedproblemcount"] = DB::table('quiz_problems')
                    ->where(array('uid'=>$userinfo->id, 'status'=>1))
                    ->count();

                if($out_data["psuploadedproblemcount"]>0)
                    $out_data["psacceptedpercent"] = sprintf("%0.1f", $out_data["psacceptedproblemcount"]/$out_data["psuploadedproblemcount"]*100);     
                else
                    $out_data["psacceptedpercent"] = 0;

                $userrank = DB::select(sprintf("SELECT count(b.cn)+1 AS userrank from (SELECT uid, count(id) AS cn FROM quiz_problems GROUP BY uid) a LEFT JOIN (SELECT uid, count(id) AS cn FROM quiz_problems GROUP BY uid) b ON a.cn < b.cn where a.uid=%d GROUP BY a.uid", $userinfo->id));
                if($userrank!=null && count($userrank)>0) {
                    $out_data["psrank"] = $userrank[0]->userrank;
                } else {
                    $out_data["psrank"] = 0;
                }

            } else if($userinfo->permission=='A') {
                $visitedcount = DB::table('users')
                        ->where(array('id'=>$userinfo->id))
                        ->get(array("visited_count"));
                $out_data["psvisitedcount"] = $visitedcount[0]->visited_count;

                $out_data["totalstudentcount"] = DB::table('users')
                    ->where(array('permission'=>'D'))
                    ->count();

                $out_data["totalteachercount"] = DB::table('users')
                    ->where(array('permission'=>'B'))
                    ->count();

                $out_data["uploadedproblemcount"] = DB::table('quiz_problems')
                    ->count();   

                $out_data["acceptedproblemcount"] = DB::table('quiz_problems')
                    ->where(array('status'=>1))
                    ->count();

                $out_data["answercount"] = DB::table('quiz_answer')
                    ->count();
                
            }
        }  else { //overview 
            $out_data["totalstudentcount"] = DB::table('users')
                    ->where(array('permission'=>'D'))
                    ->count();

            $honourstudentcount = DB::select("SELECT count(*) AS count FROM quiz_answer LEFT JOIN quiz_problems ON quiz_answer.quiz_id = quiz_problems.id LEFT JOIN users ON quiz_answer.uid=users.id WHERE users.permission = 'D' AND quiz_answer.evaluate_mark/quiz_problems.points > 0.7 GROUP BY users.id");
            if($honourstudentcount!=null && count($honourstudentcount)>0) {
                $out_data["honourstudentcount"] = count($honourstudentcount);
            } else {
                $out_data["honourstudentcount"] = 0;
            }  

            $out_data["answercount"] = DB::table('quiz_answer')
                    ->count(); 

            $out_data["uploadedproblemcount"] = DB::table('quiz_problems')
                    ->where(array('status'=>1))
                    ->count();  
        } 

        return response()->json($out_data);
    }

}
