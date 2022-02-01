import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-phoenix',
  templateUrl: './phoenix.component.html',
  styleUrls: ['./phoenix.component.css']
})
export class PhoenixComponent implements OnInit {

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private builder: FormBuilder
  ) {}

  ngOnInit(): void {

    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.collapsible');
      var instances = M.Collapsible.init(elems, {});
    });

    const dropDownElement = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropDownElement, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.tabs');
      var instances = M.Tabs.init(elems, {});
    });

    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.slider');
      var instances = M.Slider.init(elems, {});
    });

  }

  logout() {
    //once the user deletes the token, the user will be taken to login/register page
    this.tokenService.DeleteToken();
    this.router.navigate(['']);
  }

}
