import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string;
  showSpinner = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private tokenService: TokenService 
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.loginForm = this.fb.group ({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  loginUser() {
    this.showSpinner = true;
    this.authService.loginUser(this.loginForm.value).subscribe(data => {
      //console.log(data);
      //console.log(data);
      //set the token and cookie
      this.tokenService.SetToken(data.token);
      //reset the form
      this.loginForm.reset();
      //if user is logins correctly he will be taken to the 
      //path which is streams 
      //after 3 seconds take user to stream components
      setTimeout(() => {
        this.router.navigate(['streams']);
      }, 3000);      
    }, err => {
        this.showSpinner = false;
        if (err.error.message) {
          this.errorMessage = err.error.message;
        }
    });
  }

}
