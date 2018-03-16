import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from "@angular/http";

declare var $:any;
declare var Metronic: any;

@Injectable()
export class AuthService {
  constructor(public router: Router, private http: Http) {
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
    const isLoggedin = window.sessionStorage.getItem('isLoggedin');
    return isLoggedin;
  }

}
