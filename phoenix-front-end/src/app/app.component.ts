import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router, 
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    /*const token = this.tokenService.GetToken();
    //if token exists, user goes to stream page
    if(token) {
      this.router.navigate(['streams']);
    } else { 
      //otherwise to home page
      this.router.navigate(['login']);
    }*/
  }
}
