import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';

const URL = 'http://localhost:3000/api/phoenix/upload-image';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {

  //new variable FileUploader -> upload one file at a time
  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });
  user: any;
  selectedFile: any;
  images = [];
  socket: any;

  constructor(
    private usersService: UsersService, 
    private tokenService: TokenService
  ) { this.socket = io('http://localhost:3000'); }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.GetUser();

    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }

  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe(
      data => {
        this.images = data.result.images;
      },
      err => console.log(err)
    );
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

  Upload() {
    //console.log(this.selectedFile); -> show the data of the file
    //if the file exists
    if (this.selectedFile) {
      this.usersService.AddImage(this.selectedFile).subscribe(
        data => {
          this.socket.emit('refresh', {});
          //console.log(data);
          //empty input field to clear field after posting an image
          const filePath = <HTMLInputElement>document.getElementById('filePath');
          filePath.value = '';
        },
        err => console.log(err)
      );
    }
  }

  SetProfileImage(image) {
    //console.log(image);
    this.usersService.SetDefaultImage(image.imgId, image.imgVersion).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }

  //we want to return a promise of type any
  ReadAsBase64(file): Promise<any> {
    //use FileReader api
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
      //load event -> resolve the result from FileUpload
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });
      //reject the promise if error
      reader.addEventListener('error', event => {
        reject(event);
      });
      //method called from FileReader api
      //Starts reading the contents of the specified Blob, once finished,
      //the result attribute contains a data: URL representing
      //the file's data.
      reader.readAsDataURL(file);
    });

    return fileValue;
  }
}
