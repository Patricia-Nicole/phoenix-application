import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as M from 'materialize-css';
import { PostService } from 'src/app/services/post.service';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';
import io from 'socket.io-client';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit, AfterViewInit {

  tabElement: any;
  postsTab = false;
  followingTab = false;
  followersTab = false;
  posts = [];
  following = [];
  followers = [];
  user: any;
  name: any;
  postValue: any;
  editForm: FormGroup;
  modalElement: any;
  Allposts = [];
  hey: any;
  findLikes: any;

  socket: any;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private postService: PostService,
    private fb: FormBuilder
  ) { this.socket = io('http://localhost:3000'); }

  ngOnInit(): void {
    this.postsTab = true;
    const tabs = document.querySelector('.tabs');
    M.Tabs.init(tabs, {});
    this.tabElement = document.querySelector('.nav-content');

    this.route.params.subscribe(params => {
      //in modules/streams-routing.module.ts we set the path as path: ':name'
      this.name = params.name;
      this.GetUserData(this.name);
    });
  }

  ngAfterViewInit() {
    this.tabElement.style.display = 'none';
  }

  GetUserData(name) {
    this.usersService.GetUserByName(name).subscribe(
      data => {
        //console.log(data.result);
        //-> all detaild of selected user
        this.user = data.result;
        this.posts = data.result.posts.reverse();
        this.followers = data.result.followers;
        this.following = data.result.following;

        //console.log(this.posts);
        
        const id = data.result._id;
        //console.log(id);
        
        this.postService.getAllPosts().subscribe(dat => {
          //get all posts from all times
          //console.log(dat.posts);
          //get from total posts array, just the ones for the user we select
          this.hey = dat.posts.filter(
            x => x.user === id
          );
          //console.log(this.hey);
        },
        err => console.log(err) );


      },
      err => console.log(err)
    );
  }

  ChangeTab(value) {
    if (value === 'posts') {
      this.postsTab = true;
      this.followersTab = false;
      this.followingTab = false;
    }

    if (value === 'following') {
      this.postsTab = false;
      this.followersTab = false;
      this.followingTab = true;
    }

    if (value === 'followers') {
      this.postsTab = false;
      this.followersTab = true;
      this.followingTab = false;
    }
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }

}
