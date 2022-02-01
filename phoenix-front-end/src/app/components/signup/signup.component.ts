import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  errorMessage: string;
  showSpinner = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    //new variable of type Router
    private router: Router,
    private tokenService: TokenService
  ){}

  ngOnInit(): void {
    //this will allow us initialise the form
    this.init();
  }

  init() {
    this.signupForm = this.fb.group({
      //the user must add the following fileds
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    });
  }

  signupUser() {
    //the loading before taking to main page after user signed up 
    this.showSpinner = true;
    //console.log(this.signupForm.value);
    this.authService.registerUser(this.signupForm.value).subscribe(data => {
      //console.log(data);
      //set the token and cookie
      this.tokenService.SetToken(data.token);
      //reset the form
      this.signupForm.reset();
      //if user is signup correctly he will be taken to the 
      //path which is streams 
      //after 3 seconds take user to stream components
      setTimeout(() => {
        this.router.navigate(['streams']);
      }, 2500);
    }, err => {
      this.showSpinner = false;
      if (err.error.msg) {
        this.errorMessage = err.error.msg[0].message;
      }
      if (err.error.message) {
        this.errorMessage = err.error.message;
      }
    });
  }
}
