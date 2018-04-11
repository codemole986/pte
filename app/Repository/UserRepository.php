<?php

namespace App\Repository;

use App\User;
use Auth0\Login\Contract\Auth0UserRepository;

class UserRepository implements Auth0UserRepository {

    /* This class is used on api authN to fetch the user based on the jwt.*/
    public function getUserByDecodedJWT($jwt) {
      /*
       * The `sub` claim in the token represents the subject of the token
       * and it is always the `user_id`
       */
      $jwt->user_id = $jwt->sub;

      return $this->upsertUser($jwt);
    }

    public function getUserByUserInfo($userInfo) {
      return $this->upsertUser($userInfo['profile']);
    }

    protected function upsertUser($userinfo) {
      $user = User::where("auth0id", $userinfo['sub'])->first();

      if ($user === null) {
          $user = new User();
          $user->auth0id = $userinfo['sub'];
          $user->first_name = isset($userinfo['given_name']) ? $userinfo['given_name'] : '';
          $user->last_name = isset($userinfo['family_name']) ? $userinfo['family_name'] : '';
          $user->email = $userinfo['email'];
          $user->permission = 'D';
          $user->visited_count = 0;
          $user->save();
      }

      session(['userinfo' => $user]);

      return $user;
    }

    public function getUserByIdentifier($identifier) {
        //Get the user info of the user logged in (probably in session)
        $user = \App::make('auth0')->getUser();

        if ($user === null) return null;

        // build the user
        $user = $this->getUserByUserInfo($user);

        // it is not the same user as logged in, it is not valid
        if ($user && $user->auth0id == $identifier) {
            return $auth0User;
        }
    }

}
