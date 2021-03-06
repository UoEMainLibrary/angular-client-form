import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Output() setUid = new EventEmitter<string>();
  @Input() uid: string;
  @Input() messenger: MessageService;
  @Input() recaptchaValue: string;

  constructor(private uploaderService: UploaderService) {}

  clicked() {
    if (!this.recaptchaValue) {
      this.messenger.recaptchaFirst = 'Before uploading files, please validate yourself as being human using the reCaptcha at the bottom of the form.';
      return false;
    }
  }

  onPicked(input: HTMLInputElement) {
    const files = input.files;

    if (!files) {
      return;
    }

    // Reset errors from uploads
    this.messenger.errors = [];

    let fileOrFiles = input.files.length.toString();

    if ( files.length === 1 ) {
      fileOrFiles += ' file selected';
    }
    else {
      fileOrFiles += ' files selected';
    }

    input.title = fileOrFiles;
    this.messenger.uploadFiles = fileOrFiles;

    for (let i = 0; i < files.length; i++) {
      this.uploaderService.upload(this.messenger, this.uid, files[i]).subscribe(resp => this.setAppUid(resp));
    }
  }

  setAppUid(resp)  {
    if (resp.body.dest_folder) {
      this.setUid.next(resp.body.dest_folder);
    }

  }

  ngOnInit(): void {
  }

}

