import { AfterViewInit, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import * as M from 'materialize-css';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  //use the following because we want send the online event from 
  //toolbar component to chat component
  @Output() onlineUsers = new EventEmitter();
  user: any;
  notifcations = [];
  socket: any;
  count = [];
  chatList = [];
  msgNumber = 0;
  imageId: any;
  imageVersion: any;

  constructor(
    private tokenService: TokenService,
    private router: Router, 
    private usersService: UsersService,
    private msgService: MessageService
  ) { this.socket = io('http://localhost:3000'); }

  ngOnInit(): void {
    //get the payload method with user info
    this.user = this.tokenService.GetPayload();

    //dropdown elements
    //querySelector -> just for one dropdown and querySelectorAll for more
    //this is for all notifications
    const dropDownElement = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropDownElement, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });
    //this is for messages notifications
    const dropDownElementTwo = document.querySelectorAll('.dropdown-trigger1');
    M.Dropdown.init(dropDownElementTwo, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    //emit this event -> from socket/streams.js
    //if the user is online
    //the name of the room is global and the name of the user
    this.socket.emit('online', { room: 'global', user: this.user.username });

    this.GetUser();
    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }

  ngAfterViewInit() {
    //get event emited from socket/streams.js
    this.socket.on('usersOnline', data => {
      //console.log(data);
      //emit the data -> emit method not coming from socketio
      this.onlineUsers.emit(data);
    });
  }

  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe(data => {
      
      //for images
      this.imageId = data.result.picId;
      this.imageVersion = data.result.picVersion;

      this.notifcations = data.result.notifications.reverse();
      //check for read property false in notifications
      const value = _.filter(this.notifcations, ['read', false]);
      //console.log(value);
      this.count = value;
      //for the chatList -> with how many users you have chatted
      this.chatList = data.result.chatList;
      //console.log(this.chatList);

      //check is message is read -> use below method
      this.CheckIfread(this.chatList);
    },
    //on every page we have the toolbar component, so
    //THIS IS FOR AUTOMATICALLY LOGOUT WHEN TOKEN EXPIRES
    //if an error is returned and inside the error we have the token
    //then delete the token and take the user back to index page
    err => {
      if (err.error.token === null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    });
  }

  //message -> if it is read of not
  CheckIfread(arr) {
    //create the empty array
    const checkArr = [];
    //loop through the array, which has been added as param
    for (let i = 0; i < arr.length; i++) {
      //get last message from the array
      const receiver = arr[i].msgId.message[arr[i].msgId.message.length - 1];
      //if the user is already chatting on chat page, no need to display the notification
      if (this.router.url !== `/chat/${receiver.sendername}`) {
        //if isRead property is false
        if (receiver.isRead === false && receiver.receivername === this.user.username) {
          //count the message notifications
          checkArr.push(1);
          this.msgNumber = _.sum(checkArr);
        }
      }
    }
  }

  MarkAll() {
    this.usersService.MarkAllAsRead().subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

  logout() {
    //once the user deletes the token, the user will be taken to login/register page
    this.tokenService.DeleteToken();
    this.router.navigate(['']);
  }

  GoToHome() {
    this.router.navigate(['streams']);
  }

  GoToChatPage(name) {
    this.router.navigate(['chat', name]);
    //user.username -> the sender ( comes from GetPayload() )
    //and name -> receiver
    //mark messages as read
    this.msgService.MarkMessages(this.user.username, name).subscribe(data => {
      //console.log(data);
      this.socket.emit('refresh', {});
    });
  }

  //mark all messages when clicking on the button MarkAllMessages
  AllMessageMark() {
    this.msgService.AllMessagesMarked().subscribe(data => {
      //console.log(data);
      this.socket.emit('refresh', {});
      this.msgNumber = 0;
    });
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }

  //add the date to the message notifications
  MessageDate(data) {
    //moment has a method called calendar
    return moment(data).calendar(null, {
      //if message was sent today -> display today
      sameDay: '[Today]',
      //if message was sent Yesterday -> display Yesterday
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY'
    });
  }

}
