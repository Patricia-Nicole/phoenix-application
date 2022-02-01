import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

  tabElement: any;
  online_users = [];

  constructor() { }

  ngOnInit(): void {
    //get just one part of the toolbar component 
    this.tabElement = document.querySelector('.nav-content');
  }

  ngAfterViewInit() {
    //get just one part of the toolbar component
    //we set the class nav-content from toolbar to none
    this.tabElement.style.display = 'none';
  }

  //check if the user we want to send a message to is found in the array
  online(event) {
    //console.log(event); -> array with the online users
    //use the array online_users
    this.online_users = event;
  }

}
