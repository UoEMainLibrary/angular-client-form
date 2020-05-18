import {Component, EventEmitter, Host, Input, OnInit, Output} from '@angular/core';
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
  @Output() uidChange = new EventEmitter<number>();
  @Input() messenger: MessageService;

  constructor(private uploaderService: UploaderService) {}

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
      this.uploaderService.upload(this.messenger, this.uid, files[i]).subscribe(resp => this.setUid(resp));
    }
  }

  reset() {
    this.uploaderService.reset();
  }

  setUid(resp)  {
    if (resp.body.dest_folder) {
      this.uidChange.emit(resp.body.dest_folder);
    }

    console.log(this.uid);

  }

  ngOnInit(): void {
  }

}

