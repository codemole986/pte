<?php
namespace APP\Http\Controllers;
use App\Http\Controllers\Controller;

class ExController extends Controller {

	public function hello($name) {
		return 'Hello ' . $name . '!';
	}

	public function helloWithView($name) {
		return view('ex.hello', ['name' => $name]);
	}
}