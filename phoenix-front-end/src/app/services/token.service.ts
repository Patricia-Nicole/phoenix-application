import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private cookieService: CookieService) { }

  SetToken(token) {
    this.cookieService.set('phoenix_token', token);
  }

  GetToken() {
    return this.cookieService.get('phoenix_token');
  }
  
  DeleteToken() {
    this.cookieService.delete('phoenix_token');
  }

  //JSON TOKEN components are: Header, Payload and Signature
  //they are separated by dot
  GetPayload() {
    //get the token
    const token = this.GetToken();
    //create variable
    let payload;
    if(token) {
      //from the array we got the second elem - index 1, 
      //which is the payload
      payload = token.split('.')[1];
      //the string we get is in base 64 and we decrypt the data with atob
      payload = JSON.parse(window.atob(payload));
    }
    //return just the data object from payload (the user info)
    return payload.data;
  }
}
