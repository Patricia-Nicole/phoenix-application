import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { PostService } from 'src/app/services/post.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-top-streams',
  templateUrl: './top-streams.component.html',
  styleUrls: ['./top-streams.component.css']
})
export class TopStreamsComponent implements OnInit {

  socket: any;
  topPosts = [];
  user: any;

  constructor(
    private postService: PostService, 
    private tokenService: TokenService, 
    private router: Router
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.AllPosts();
    //new post -> refresh the page and show the posts
    this.socket.on('refreshPage', (data) => {
      this.AllPosts();
    });
  }

  AllPosts() {
    this.postService.getAllPosts().subscribe(data => {
      this.topPosts = data.top;
    },
    //THIS IS FOR AUTOMATICALLY LOGOUT WHEN TOKEN EXPIRES
    //if an error is returned and inside the error we have the token
    //then delete the token and take the user back to index page
    err => {
      if (err.error.token === null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    }
    )
  }

  LikePost(post) {
    this.postService.addLike(post).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }

  //Lodash( _ ) makes JavaScript easier by taking the hassle out of 
  //working with arrays, numbers, objects, strings, etc.
  CheckInLikesArray(arr, username) {
    //inside the likes array (arr), we check if the username exists
    //return false if the username is found in the likes array
    return _.some(arr, { username: username });
  }

  TimeFromNow(time) {
    //it will display when the posts were made - e.g. 10 years ago
    return moment(time).fromNow();
  }

  OpenCommentBox(post) {
    //create a new router 'post' in streams router
    this.router.navigate(['post', post._id]);
  }

}
