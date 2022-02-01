import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import io from 'socket.io-client';
import { FileUploader } from 'ng2-file-upload';

const URL = 'http://localhost:3000/api/phoenix/upload-image';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  //new variable FileUploader -> upload one file at a time
  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  selectedFile: any;

  //emit the events we want usin socket
  socket: any;
  postForm: FormGroup

  constructor(private fb: FormBuilder, private postService: PostService) { 
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.postForm = this.fb.group ({
      post: ['', Validators.required]
    })
  }

  SubmitPost() {
    let body;
    //if user wants to send just a message not an image as well
    if (!this.selectedFile) {
      body = {
        //then body is an object just with the text post
        post: this.postForm.value.post
      };
    } else {
      body = {
        //then body is an object with the text post and image post as well
        post: this.postForm.value.post,
        image: this.selectedFile
      };
    }
    this.postService.addPost(body).subscribe(data => {
      //console.log(data);
      //when the user adds a new post -> emit refresh event
      //then go to server -> stream.js and listen to refresh event
      this.socket.emit('refresh', {});
      this.postForm.reset();
    });
  }

  OnFileSelected(event) {
    //console.log(event); -> display the name of the image we want to upload 
    //and a FileList with time/type/name/length

    //get the file from the event
    const file: File = event[0];
    //call the method ReadAsBase64 and pass the file coming from the event
    this.ReadAsBase64(file)
    //as it returns a promise, we use then and catch
      .then(result => {
        this.selectedFile = result;
      })
      .catch(err => console.log(err));
  }

  ReadAsBase64(file): Promise<any> {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });

      reader.addEventListener('error', event => {
        reject(event);
      });

      reader.readAsDataURL(file);
    });

    return fileValue;
  }
}
