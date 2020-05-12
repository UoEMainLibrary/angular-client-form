import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {
  public messages = new Map();
  public uploadMessage = 'Upload file(s)';
  public uploadFiles = 'Choose one or more files';
  public completed = 0;

  add(file: string, message: object) {
    this.messages.set(file, message);
  }

  clear(file) {
    this.messages.delete(file);
  }
}
