import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import * as M from 'materialize-css';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  
  socket: any;
  posts = [];
  user: any;
  editForm: FormGroup;
  postValue: any;
  modalElement: any;

  allInfo: any;
  name: any;
  Info = [];
  i: any;

  newObject: any;
  myArray = [];

  constructor(
    private postService: PostService,
    private tokenService: TokenService,
    private router: Router,
    private fb: FormBuilder
    ) { 
    this.socket = io('http://localhost:3000');
   }

  ngOnInit(): void {

    //modal -> https://materializecss.com/modals.html
    //get the class modal from html file
    this.modalElement = document.querySelector('.modal');
    //from materiazed.css call the method Modal and init
    M.Modal.init(this.modalElement, {});

    this.user = this.tokenService.GetPayload();
    this.AllPosts();
    //new post -> refresh the page and show the posts
    this.socket.on('refreshPage', (data) => {
      this.AllPosts();
    });

    this.InitEditForm();
  }

  //only validate the edited form -> input field required to edit the post
  InitEditForm() {
    this.editForm = this.fb.group({
      editedPost: ['', Validators.required]
    });
  }

  AllPosts() {
    this.postService.getAllPosts().subscribe(data => {
      //console.log(data);
      this.posts = data.posts;
      //console.log(this.posts); 

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

  OpenEditModal(post) {
    //console.log(post); -> the current post with all its details
    this.postValue = post;
    //console.log(this.postValue);
  }

  SubmitEditedPost() {
    //console.log(this.editForm.value) -> {editedPost: "hi"}
    //send id and post to back-end
    const body = {
      id: this.postValue._id,
      post: this.editForm.value.editedPost
    };
    this.postService.EditPost(body).subscribe(
      data => {
        //console.log(data);
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
    M.Modal.getInstance(this.modalElement).close();
    this.editForm.reset();
  }

  CloseModal() {
    //this comes from https://materializecss.com/modals.html
    //first get the instance of the modal
    M.Modal.getInstance(this.modalElement).close();
    this.editForm.reset();
  }

  DeletePost() {
    //the post we select we want to delete
    this.postService.DeletePost(this.postValue._id).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
    M.Modal.getInstance(this.modalElement).close();
  }

  LikePost(post) {
    //console.log(post);
    this.postService.addLike(post).subscribe(data => {
      //console.log(data);
      this.socket.emit('refresh', {});
    }, err => console.log(err));
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
