<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
  public function get(Request $request)
  {
    $userinfo = $request->session()->get('userinfo');

    if (is_null($userinfo)) {
      $out_data["state"] = "error";
      $out_data["message"] = "Please log in.";
      return response()->json($out_data, 200);
    }

    $out_data["state"] = "success";
    $out_data["userinfo"] = $userinfo;
    $out_data["_token"] = csrf_token();

    return response()->json($out_data, 200);
  }
}
