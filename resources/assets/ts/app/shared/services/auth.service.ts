import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import Auth0Lock from 'auth0-lock';

@Injectable()
export class AuthService {
  clientID = '0l5lwvnUwDloNvmjXPTlxPG8wmfzAdgp';
  domain = 'flyplay91.auth0.com';

  lock = new Auth0Lock(this.clientID, this.domain, {
    autoclose: true,
    auth: {
      audience: 'https://flyplay91.auth0.com/userinfo',
      responseType: 'token id_token',
      redirect: false,
      params: {
        scope: 'openid'
      }
    }
  });

  constructor(public router: Router, public route: ActivatedRoute) {
    this.lock.on('authenticated', (authResult: any) => {
      if (!authResult) {
        this.router.navigate(['/']);
        console.log('error');
      } else {
        // user has an active session, so we can use the accessToken directly.
        this.lock.getUserInfo(authResult.accessToken, function (error, profile) {
          console.log(error, profile);
        });
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/dashboard']);
      }
    });
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
