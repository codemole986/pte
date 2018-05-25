<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

class SoundcloudController extends Controller
{
  public function get(Request $request, $id)
  {
    $json = json_decode(file_get_contents('https://api.soundcloud.com/tracks/' . $id . '.json?consumer_key=Iy5e1Ri4GTNgrafaXe4mLpmJLXbXEfBR'), true);
    $res = array(
      'id' => $id,
      'name' => $json['title'],
      'artist' => $json['user']['username'],
      'streamUrl' => $json['stream_url'],
      'provider' => 1,
      'idFromProvider' => (string)$id,
      'duration' => $json['duration'],
      'imageUrl' => $json['user']['avatar_url'],
      'link' => $json['permalink_url']
    );

    return response()->json($res, 200);
  }
}
