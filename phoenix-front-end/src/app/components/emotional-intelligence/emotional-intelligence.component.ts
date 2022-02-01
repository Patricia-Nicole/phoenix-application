import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-emotional-intelligence',
  templateUrl: './emotional-intelligence.component.html',
  styleUrls: ['./emotional-intelligence.component.css']
})
export class EmotionalIntelligenceComponent implements OnInit {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const dropDownElement = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropDownElement, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });
  }

  logout() {
    //once the user deletes the token, the user will be taken to login/register page
    this.tokenService.DeleteToken();
    this.router.navigate(['']);
  }
}
