import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {
  // type Message = { file: string; msg: string };
  // messages: Map<string, string> = new Map<string, string>();
  // messages = [];
 public messages = new Map();

  add(file: string, message: string) {
    this.messages.set(file, message);
  }

  clear(file) {
    this.messages.delete(file);
  }
}
