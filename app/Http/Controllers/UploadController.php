<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
  public function post(Request $request)
  {
    $path = $request->file->store('public/uploads');
    $public_path = Storage::url($path);
    return response()->json(array('path' => $public_path));
  }
}
