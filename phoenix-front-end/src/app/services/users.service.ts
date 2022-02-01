import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASEURL = 'http://localhost:3000/api/phoenix';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  //it will return an observable
  GetAllUsers(): Observable<any> {
    return this.http.get(`${BASEURL}/users`);
  } 
  //if we do not want to use observable, we can use promises
  //So it will look like:
  // async GetAllUsers() {
  //   return await this.http.get(`${BASEURL}/users`);
  // } 
  //then we call the then() method

  GetUserById(id): Observable<any> {
    return this.http.get(`${BASEURL}/user/${id}`);
  }

  GetUserByName(username): Observable<any> {
    return this.http.get(`${BASEURL}/username/${username}`);
  }

  FollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/follow-user`, {
      userFollowed
    });
  }

  UnFollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/unfollow-user`, {
      userFollowed
    });
  }

  MarkNotification(id, deleteValue?): Observable<any> {
    return this.http.post(`${BASEURL}/mark/${id}`, {
      id,
      deleteValue
    });
  }

  MarkAllAsRead(): Observable<any> {
    return this.http.post(`${BASEURL}/mark-all`, {
      all: true
    });
  }

  AddImage(image): Observable<any> {
    return this.http.post(`${BASEURL}/upload-image`, {
      //send the image to the back-end
      image
    });
  }

  SetDefaultImage(imageId, imageVersion): Observable<any> {
    //set the profile picture 
    return this.http.get(`${BASEURL}/set-default-image/${imageId}/${imageVersion}`);
  }

  //when someone is viewing the profile
  ProfileNotifications(id): Observable<any> {
    return this.http.post(`${BASEURL}/user/view-profile`, { id });
  }

  ChangePassword(body): Observable<any> {
    return this.http.post(`${BASEURL}/change-password`, body);
  }
}
