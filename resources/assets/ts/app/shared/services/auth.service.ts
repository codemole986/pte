import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from "@angular/http";

declare var $:any;
declare var Metronic: any;

@Injectable()
export class AuthService {
  constructor(public router: Router, private http: Http) {
  }

  public get(): void {
    this.http.get('/auth')
      .map(
        (response) => response.json()
      )
      .subscribe(
        (data) => {
          if (data.state === 'error') {
            window.sessionStorage.clear();
          } else {
            window.sessionStorage.setItem('isLoggedin', 'true');
            window.sessionStorage.setItem('userid', data.userinfo.id);
            window.sessionStorage.setItem('_token', data._token);
            window.sessionStorage.setItem('permission', data.userinfo.permission);
            window.sessionStorage.setItem('username', `${data.userinfo.first_name} ${data.userinfo.last_name}`);
            window.sessionStorage.setItem('userphoto', data.userinfo.photo);

            $('body').removeClass('login');
          }
          Metronic.init();
        }
      );
  }

  public login(): void {
    window.location.pathname = '/user/login';
  }

  public signup(): void {
    window.location.pathname = '/user/login';
  }

  public logout(): void {
    // Remove tokens and expiry time from window.sessionStorage
    this.http.get('/user/logout')
      .map(
        (response) => response.json()
      )
      .subscribe(
        (data) => {
          console.log(data);
          window.sessionStorage.clear();
          // this.router.navigateByUrl('/');
          window.location.pathname = '/';
        }
      );
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(window.sessionStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

}
