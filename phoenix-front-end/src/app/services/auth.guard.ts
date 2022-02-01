import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router, 
    private tokenService: TokenService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //check if the token exists
    const token = this.tokenService.GetToken();
    //if yes return true
    //here not checking if token valid or not, just if it exists
    if(token) {
      return true;
    } else{
      //otherwise take user to login/register page
      this.router.navigate(['/']);
      return false;
    }
    
  }
}
