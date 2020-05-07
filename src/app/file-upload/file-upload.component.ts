import { Component, OnInit } from '@angular/core';
import { UploaderService } from './file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  providers: [ UploaderService ]
})

export class FileUploadComponent implements OnInit {
  message: string;

  constructor(private uploaderService: UploaderService) {}

  onPicked(input: HTMLInputElement) {
    const files = input.files;
    if (files) {
      this.uploaderService.upload(files).subscribe(
        msg => {
          input.value = null;
          this.message = msg;
        }
      );
    }
  }

  ngOnInit(): void {
  }

}

/*
import { Component } from '@angular/core';
import { UploaderService } from './uploader.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  providers: [ UploaderService ]
})
export class UploaderComponent {
  message: string;

  constructor(private uploaderService: UploaderService) {}

  onPicked(input: HTMLInputElement) {
    const file = input.files[0];
    if (file) {
      this.uploaderService.upload(file).subscribe(
        msg => {
          input.value = null;
          this.message = msg;
        }
      );
    }
  }
}*/
