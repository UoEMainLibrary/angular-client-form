import { Component, OnInit } from '@angular/core';
import { UploaderService } from './file-upload.service';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.min.css',],
  providers: [ UploaderService ]
})

export class FileUploadComponent implements OnInit {

  constructor(private uploaderService: UploaderService, public messenger: MessageService) {}

  onPicked(input: HTMLInputElement) {
    const files = input.files;

    if (files) {
      for( let i = 0; i < files.length; i++) {
        this.uploaderService.upload(this.messenger, files[i]).subscribe();
      }
    }
  }

  ngOnInit(): void {
  }

}

