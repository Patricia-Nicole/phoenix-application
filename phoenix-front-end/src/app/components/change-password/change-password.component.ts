import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.Init();
  }

  Init() {
    this.passwordForm = this.fb.group(
      {
        //these will be required fields
        cpassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      {
        //use the validator method from below
        //binding password form to what is inside the method
        validator: this.Validate.bind(this)
      }
    );
  }

  ChangePassword() {
    //from services/user.service.ts
    this.usersService.ChangePassword(this.passwordForm.value).subscribe(
      data => {
        //console.log(data);
        //reset the password
        this.passwordForm.reset();
      },
      err => console.log(err)
    );
  }

  Validate(passwordFormGroup: FormGroup) {
    //want to validate the new password -> same password in formGroup
    const new_password = passwordFormGroup.controls.newPassword.value;
    const confirm_password = passwordFormGroup.controls.confirmPassword.value;

    //if the password is less than 0
    if (confirm_password.length <= 0) {
      return null;
    }

    if (confirm_password !== new_password) {
      return {
        doesNotMatch: true
      };
    }

    return null;
  }

}
