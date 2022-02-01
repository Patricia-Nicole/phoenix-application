import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import io from 'socket.io-client';
import * as moment from 'moment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit {

  toolbarElement: any;
  socket: any;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute
  ) { this.socket = io('http://localhost:3000'); }

  commmentForm: FormGroup;
  postId: any;
  commentsArray = [];
  post: string;

  ngOnInit(): void {
    //select elem with class nav-content from toolbar.html
    //and display at ngAfterViewInit()
    this.toolbarElement = document.querySelector('.nav-content');
    //get post id from the route from path: 'post/:id'
    //which is in modules/streams-routing.module.ts
    this.postId = this.route.snapshot.paramMap.get('id');

    this.init();

    this.GetPost();

    //this event is coming from backend -> socket -> streams.js
    //once a user adds an even, the server listens to the event and 
    //it will refresh the page and the GetPost() method will be load
    //and what is saved in the database will be displayed
    this.socket.on('refreshPage', data => {
      this.GetPost();
    });
  }

  init() {
    this.commmentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  }

  AddComment() {
    //console.log(this.commmentForm.value);
    //this is what we are gonna send to backend
    //this.commmentForm.value is sending an object, so we want to get the comment from it
    this.postService.addComment(this.postId, this.commmentForm.value.comment).subscribe(data => {
      //console.log(data);
      //refresh the page
      this.socket.emit('refresh', {});
      //once the data has been sent, reset the form
      this.commmentForm.reset();
    })
  }

  GetPost() {
    this.postService.getPost(this.postId).subscribe(data => {
      //console.log(data);
      //this will show the original post
      this.post = data.post.post;
      //this is for all the other comments the user added afterwards
      //and they are displayed in a reverse order
      //from the most recent to the most old post
      this.commentsArray = data.post.comments.reverse();
      //console.log(this.commentsArray);
    });
  }

  TimeFromNow(time) {
    //it will display when the posts were made - e.g. 10 years ago
    return moment(time).fromNow();
  }

}
