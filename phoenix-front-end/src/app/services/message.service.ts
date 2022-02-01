import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASEURL = 'http://localhost:3000/api/phoenix';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  //use driven template forms, not reactive template forms
  //Template-driven forms are asynchronous in nature
  //when we will call the following method we need to pass the 3 parameters
  SendMessage(senderId, receiverId, receiverName, message): Observable<any> {
    //as params we have sendersId and receiverId
    return this.http.post(`${BASEURL}/chat-messages/${senderId}/${receiverId}`, {
      //send the following, no need to send the senderName or senderId,
      //because we can easily get those using req.user
      receiverId,
      receiverName,
      message
    });
  }

  //get all messages from both users
  GetAllMessages(senderId, receiverId): Observable<any> {
    //as params we have sendersId and receiverId
    return this.http.get(`${BASEURL}/chat-messages/${senderId}/${receiverId}`);
  }

  //mark just one message by clicking on it
  MarkMessages(sender, receiver): Observable<any> {
    return this.http.get(`${BASEURL}/receiver-messages/${sender}/${receiver}`);
  }

  //mark all messages by clicking on markAllMessages button
  AllMessagesMarked(): Observable<any> {
    return this.http.get(`${BASEURL}/all-messages-marked`);
  }
}
