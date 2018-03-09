import { Injectable, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/filter';
import Auth0Lock from 'auth0-lock';

declare var $:any;
declare var Metronic: any;

@Injectable()
export class AuthService implements OnInit {
  domain = window.sessionStorage.getItem('AUTH0_DOMAIN');
  clientID = window.sessionStorage.getItem('AUTH0_CLIENT_ID');
  appUrl = window.sessionStorage.getItem('APP_URL');

  lock = new Auth0Lock(this.clientID, this.domain, {
    autoclose: true,
    auth: {
      audience: `https://${this.domain}/userinfo`,
      responseType: 'token id_token',
      redirect: true,
      responseMode: 'form_post',
      redirectUrl: `${this.appUrl}/user/login`,
      params: {
        scope: 'openid profile email'
      }
    }
  });

  constructor(public router: Router, public route: ActivatedRoute, private http: Http) {
    this.lock.on('authenticated', (authResult: any) => {
      if (!authResult) {
        this.router.navigate(['/']);
        console.log('error');
      } else {
        this.http.post("/user/login", authResult).
          map(
            (response) => response.json()
          ).
          subscribe(
            (data) => {
              if (data.length == 0) {
                return;
              } else if(data.state == "error") {
                Metronic.showErrMsg(data.message);
              } else {
                window.sessionStorage.setItem("isLoggedin", 'true');
                window.sessionStorage.setItem("userid", data.userinfo.id);
                window.sessionStorage.setItem("_token", data._token);
                window.sessionStorage.setItem('permission', data.userinfo.permission);
                window.sessionStorage.setItem('username', data.userinfo.first_name + ' ' + data.userinfo.last_name);
                window.sessionStorage.setItem('userphoto', data.userinfo.photo);
                
                $('body').removeClass('login');
                this.router.navigate(['dashboard']);  

                window.location.hash = '';
                this.setSession(authResult);
                this.router.navigate(['/']);        
              }
            }
          );
      }
    });
  }

  ngOnInit() {
    Metronic.init();
  }

  public login(): void {
    this.lock.show({
      initialScreen: 'login'
    });
  }

  public signUp(): void {
    this.lock.show({
      initialScreen: 'signUp'
    });
  }

  private setSession(authResult: any): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    window.sessionStorage.setItem('access_token', authResult.accessToken);
    window.sessionStorage.setItem('id_token', authResult.idToken);
    window.sessionStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from window.sessionStorage
    window.sessionStorage.removeItem('access_token');
    window.sessionStorage.removeItem('id_token');
    window.sessionStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(window.sessionStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

}
