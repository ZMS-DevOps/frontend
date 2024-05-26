import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  logInLink = { text: 'Log in', url: '/booking/auth/login' };
  signUpLink = { text: 'Sign up', url: '/booking/auth/signup' };
  userLink = { text: 'Me', url: '/booking/auth/login' };
}
