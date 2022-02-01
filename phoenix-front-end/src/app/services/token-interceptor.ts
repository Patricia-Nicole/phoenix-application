import { TokenService } from './token.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

//for every request we will check for the token
@Injectable()
export class TokenInterceptor implements HttpInterceptor{
    constructor(private tokenService: TokenService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const headersConfig = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      };
      //get the token
      const token = this.tokenService.GetToken();
      if (token) {
          //set the token as authorization
        headersConfig['Authorization'] = `beader ${token}`;
      }
      //clone the token
      const _req = req.clone({ setHeaders: headersConfig });
      //handle the request that has been cloned
      return next.handle(_req);
    }
}
