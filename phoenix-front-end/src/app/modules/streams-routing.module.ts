import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';
import { ChatComponent } from '../components/chat/chat.component';
import { CommentsComponent } from '../components/comments/comments.component';
import { FollowersComponent } from '../components/followers/followers.component';
import { FollowingComponent } from '../components/following/following.component';
import { ImagesComponent } from '../components/images/images.component';
import { NotificationsComponent } from '../components/notifications/notifications.component';
import { PeopleComponent } from '../components/people/people.component';
import { StreamsComponent } from '../components/streams/streams.component';
import { ViewUserComponent } from '../components/view-user/view-user.component';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
  {
    //if user signin or login successfully will be taken to streams component
    //via this path
    path: 'streams',
    component: StreamsComponent,
    //if token valid and accessible, 
    //the user will be assest to this string page 
    //otherwise user will be taken back to index page = login/register
    canActivate: [AuthGuard]
  },
  {
    path: 'post/:id',
    component: CommentsComponent,
    //with this comment component will be protected
    canActivate: [AuthGuard]
  },
  {
    //new path for people
    path: 'people',
    component: PeopleComponent,
    //with this comment component will be protected
    canActivate: [AuthGuard]
  },
  {
    path: 'people/following',
    component: FollowingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'people/followers',
    component: FollowersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'chat/:name',
    component: ChatComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'images/:name',
    component: ImagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':name',
    component: ViewUserComponent,
    canActivate: [AuthGuard]
  },
  //change the password
  {
    path: 'account/password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard]
  },
  //if a route is visited, but the route is not defined here(or in our application)
  //we call the redirectTo method
  {
    path: '**',
    redirectTo: 'streams'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StreamsRoutingModule { }
