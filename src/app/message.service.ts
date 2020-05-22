import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {
  public messages = new Map();
  public errors = [];
  public uploadMessage = 'Upload file(s)';
  public uploadFiles = 'Select one or more files';
  public completed = 0;

  add(file: string, message: object) {
    this.messages.set(file, message);
  }

  clear(file) {
    this.messages.delete(file);
  }

  public reset() {
    this.completed = 0;
    this.messages.clear();
    this.uploadMessage = 'Upload file(s)';
    this.uploadFiles = 'Select one or more files';
  }

}
