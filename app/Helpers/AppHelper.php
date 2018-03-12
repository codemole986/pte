<?php

namespace App\Helpers;

use Auth0\SDK\Auth0Api;
use Auth0\SDK\API\Authentication;

class AppHelper {
  private $oauth;
  private $auth0;
  private $auth0Api;
  private $auth0Config;
  private $audience;
  private $token;
  private $grantType = 'client_credentials';
  private $scopes = ['create', 'read', 'delete', 'update'];
  private $userProperties = ['permission', 'class', 'verification_code', 'visited_count'];

  public function __construct() {
    $this->auth0Config = config('laravel-auth0');
    $this->audience = getenv('AUTH0_API_IDENTIFIER');
    $this->oauth = new Authentication($this->auth0Config['domain'], $this->auth0Config['client_id'], $this->auth0Config['client_secret']);
    $this->token = $this->getAccess_token();
    $this->auth0Api = $this->getAuth0Api($this->token, $this->auth0Config['domain']);
  }

  public function getUser($sub) {
    $user = $this->auth0Api->users->get($sub);

    if (array_key_exists('app_metadata', $user)) {
      foreach ($user['app_metadata'] as $key => $value) {
        $user[$key] = $value;
      }
    }

    if (array_key_exists('user_metadata', $user)) {
      foreach ($user['user_metadata'] as $key => $value) {
        $user[$key] = $value;
      }
    }

    return $user;
  }

  public function getToken() {
    return $this->oauth->oauth_token([
      'grant_type' => $this->grantType,
      'audience' => $this->audience
    ]);
  }

  public function getAccess_token() {
    return $this->getToken()['access_token'];
  }

  public function getAuth0Api($accessToken, $domain) {
    return new Auth0Api($accessToken, $domain);
  }

  public function getUsers($params = []) {
    if (!isset($params['per_page'])) {
      $params['per_page'] = 5;
    }
    if (!isset($params['page'])) {
      $params['page'] = 0;
    }
    if (!isset($params['include_totals'])) {
      $params['include_totals'] = true;
    }
    if (!isset($params['sort'])) {
      $params['sort'] = 'given_name:1';
    }
    return $this->auth0Api->users->getAll($params);
  }

}
