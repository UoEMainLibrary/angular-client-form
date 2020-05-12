import {Component, Input, OnInit} from '@angular/core';
import { UploaderService } from './file-upload.service';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.min.css', ],
  providers: [ UploaderService ]
})

export class FileUploadComponent implements OnInit {
  @Input() uid: number;
  constructor(private uploaderService: UploaderService, public messenger: MessageService) {}

  onPicked(input: HTMLInputElement) {
    const files = input.files;

    if (!files) {
      return;
    }

    let fileOrFiles = input.files.length.toString();

    if ( files.length === 1 ) {
      fileOrFiles += ' file chosen';
    }
    else {
      fileOrFiles += ' files chosen';
    }

    input.title = fileOrFiles;
    this.messenger.uploadFiles = fileOrFiles;

    for (let i = 0; i < files.length; i++) {
      this.uploaderService.upload(this.messenger, this.uid, files[i]).subscribe();
    }
  }

  ngOnInit(): void {
  }

}

