import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

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

    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.sidenav');
      var instances = M.Sidenav.init(elems, {});
    });
  }

  logout() {
    //once the user deletes the token, the user will be taken to login/register page
    this.tokenService.DeleteToken();
    this.router.navigate(['']);
  }

}
