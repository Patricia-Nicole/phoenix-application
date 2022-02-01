import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASEURL = 'http://localhost:3000/api/phoenix';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}
  //new method register user that takes the body object
  registerUser(body): Observable<any> {
    return this.http.post(`${BASEURL}/register`, body);
  }
  //new method login user that takes the body object
  loginUser(body): Observable<any> {
    return this.http.post(`${BASEURL}/login`, body);
  }
}
