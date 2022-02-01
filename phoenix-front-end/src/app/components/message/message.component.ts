import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import _ from 'lodash';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit, OnChanges  {

  //allow data to be send from parent component to child component
  //from chat to message component.ts -> used for online users
  //we could use an alias as: @Input('name of alias') users;
  @Input() users;

  receiver: string;
  user: any;
  message: string;
  receiverData: any;
  messagesArray = [];
  socket: any;
  typingMessage;
  typing = false;
  isOnline = false;
  isEmojiPickerVisible: boolean;
  //usersArray = [];

  constructor( 
    private tokenService: TokenService,
    private msgService: MessageService,
    private route: ActivatedRoute,
    private usersService: UsersService
  ) { this.socket = io('http://localhost:3000'); }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    //this is for getting a parameter from the url, for example the username
    //from modules/stream-routing.modules.ts -> we get the path
    //e.g from path: 'chat/:name', we will get the name
    this.route.params.subscribe(params => {
      //console.log(params);
      this.receiver = params.name;
      this.GetUserByUsername(this.receiver);
    });

    this.socket.on('refreshPage', () => {
      this.GetUserByUsername(this.receiver);
    });

    //this.users is an input property
    //and get the value of online users from chat.components.ts
    //which is the parent component of message.component.ts
    //this.usersArray = this.users;
    //console.log(this.usersArray);

    //'is_typing' is coming from socket/private.js
    this.socket.on('is_typing', data => {
      if (data.sender === this.receiver) {
        //console.log(data);
        this.typing = true;
      }
    });

    //'has_stopped_typing' is coming from socket/private.js
    this.socket.on('has_stopped_typing', data => {
      if (data.sender === this.receiver) {
        this.typing = false;
      }
    });

  }

  //detect changes that are made in components and return the values
  ngOnChanges(changes: SimpleChanges) {
    //console.log(this.users); -> display the online users
    //console.log(changes); -> display the online users (kind of same)

    //nameCol is the name of the class in the html
    //we want to display the name of the user in the middle if the user is inactive
    const title = document.querySelector('.nameCol');

    //to not display empty arrays []
    if (changes.users.currentValue.length > 0) {
      //console.log(changes.users.currentValue);
      //using indexOf of lodash(_)
      //in order to check the array and return the index of the user
      //the array we pass is changes.users.currentValue
      //look for this.receiver
      //if it does not found the user index it will return -1
      const result = _.indexOf(changes.users.currentValue, this.receiver);
      if (result > -1) {
        this.isOnline = true;
        //to get the html property we need to set the title as HTMLElement
        //and look for style property
        (title as HTMLElement).style.marginTop = '10px';
      } else {
        this.isOnline = false;
        (title as HTMLElement).style.marginTop = '20px';
      }
    }
  }

  ngAfterViewInit() {
    const params = {
      room1: this.user.username,
      room2: this.receiver
    };

    //when the user opens the chatpage, the event will be emitted
    //see -> back-end -> socket/private.js
    this.socket.emit('join chat', params);
  }

  GetUserByUsername(name) {
    this.usersService.GetUserByName(name).subscribe(data => {
      //console.log(data);
      this.receiverData = data.result;
      //call the method GetMessages -> in the data.result we have the data of the receiver
      this.GetMessages(this.user._id, data.result._id);
    });
  }

  //get all messages from both users
  GetMessages(senderId, receiverId) {
    this.msgService.GetAllMessages(senderId, receiverId).subscribe(data => {
      this.messagesArray = data.messages.message;
    });
  }

  SendMessage() {
    //send message just if the text input is not empty
    if(this.message) {
      this.msgService
        .SendMessage(
          this.user._id, 
          this.receiverData._id, 
          this.receiverData.username, 
          this.message
        )
        .subscribe(data => {
          //console.log(data);
          this.socket.emit('refresh', {});
          this.message = '';
      });
    }
  }

  public addEmoji(event) {
    this.message = `${this.message}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

  //when the user is typing
  IsTyping() {
    //start_typing -> name of the event -> in server file: socket/private.js
    this.socket.emit('start_typing', {
      sender: this.user.username,
      receiver: this.receiver
    });

    //clear the timeout in order to start the time again
    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender: this.user.username,
        receiver: this.receiver
      });
    }, 500);
  }
  

  

}
