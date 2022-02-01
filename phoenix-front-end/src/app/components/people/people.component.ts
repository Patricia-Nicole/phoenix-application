import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  socket: any;
  users = [];
  loggedInUser: any;
  userArr = [];
  onlineusers = [];

  constructor(
    private usersService: UsersService, 
    private tokenService: TokenService, 
    private router: Router
  ) { this.socket = io('http://localhost:3000'); }

  ngOnInit(): void {
    //get the user who is logged in
    this.loggedInUser = this.tokenService.GetPayload();
    this.GetUsers();
    this.GetUser();

    this.socket.on('refreshPage', () => {
      this.GetUsers();
      this.GetUser();
    });
  }

  GetUsers() {
    this.usersService.GetAllUsers().subscribe(data => {
      //use use the remove method, go into the data.result array
      //which is an object array and search for any object where the username 
      //is equal to the username of the logged in user
      //and we get the username(the user who is logged in) from the tokenService
      _.remove(data.result, {username: this.loggedInUser.username});
      //console.log(data);
      //get the array from the response and setting it to the above array users
      this.users = data.result;
    });
  }

  GetUser() {
    this.usersService.GetUserById(this.loggedInUser._id).subscribe(data => {
      //console.log(data);
      this.userArr = data.result.following;
      //console.log(this.userArr)
    });
  }

  FollowUser(user) {
    //console.log(user);
    //send the id of the followed user to the database
    this.usersService.FollowUser(user._id).subscribe(data => {
      //console.log(data);
      //when user click this button, then emit this event to the server
      this.socket.emit('refresh', {});
    });
  }

  ViewUser(user) {
    this.router.navigate([user.username]);
    //when someone is viewing the profile
    //but we want to show a notification just if other
    //user than ouserlves views the profile
    if (this.loggedInUser.username !== user.username) {
      //console.log(user.username);
      //when someone clicks on view user profile -> services/users.services.ts
      this.usersService.ProfileNotifications(user._id).subscribe(
        data => {
          this.socket.emit('refresh', {});
        },
        err => console.log(err)
      );
    }
  }

  //check if one particular user is present in the array of the loggedin user
  //if he/she is present, that means that the user has been followed
  CheckInArray(arr, id) {
    //lodash find method to search in the array -> see lodash documentation
    //we check if userFollowed._id has the particular value: id
    //and then if the id is inside the array arr
    const result = _.find(arr, ['userFollowed._id', id]);
    //console.log(result);
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  online(event) {
    this.onlineusers = event;
  }

  CheckIfOnline(name) {
    //return the index of the value from the array onlineusers 
    //search by name
    const result = _.indexOf(this.onlineusers, name);
    if (result > -1) {
      return true;
    } else {
      return false;
    }
  }

}
