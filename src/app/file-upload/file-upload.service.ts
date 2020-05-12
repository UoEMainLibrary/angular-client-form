import { Injectable } from '@angular/core';
import {
  HttpClient, HttpEvent, HttpEventType, HttpProgressEvent,
  HttpRequest, HttpResponse, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';

import { of } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';

import { MessageService } from '../message.service';

@Injectable()
export class UploaderService {
  public messenger: MessageService;
  constructor(
    private http: HttpClient) {}

  upload(messenger: MessageService, uid: number, file: File) {
    if (!File) { return; }
    this.messenger = messenger;

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('uid', uid.toString());

    const req = new HttpRequest('POST', 'http://127.0.0.1:5000/api/', formData, {reportProgress: true}, );

    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file)),
      tap(message => this.showProgress(message)),
      last(), // return last (completed) message to caller
      catchError(this.handleError(file))
    );
  }

  /** Return distinct message for sent, upload progress, & response events */
  private getEventMessage(event: HttpEvent<any>, file: File) {
    const obj = { file: file.name, event: event.type, msg: '', percent: 100, };
    switch (event.type) {
      case HttpEventType.Sent:
        obj.msg = `Uploading "${file.name}" of size ${file.size}.`;
        break;
      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        obj.percent = Math.round(100 * event.loaded / event.total);
        obj.msg = `"${file.name}" is ${obj.percent}% uploaded.`;
        break;
      case HttpEventType.Response:
        this.messenger.completed += 1;
        this.messenger.uploadMessage = `Uploaded ${this.messenger.completed} / ${this.messenger.messages.size}`;
        // obj.percent = 100;
        obj.msg = `"${file.name}" was successfully uploaded.`;
        break;
      default:
        obj.msg = `"${file.name}" surprising upload event: ${event.type}.`;
    }
    return obj;
  }

  /**
   * Returns a function that handles Http upload failures.
   * @param file - File object for file being uploaded
   *
   * When no `UploadInterceptor` and no server,
   * you'll end up here in the error handler.
   */
  private handleError(file: File) {
    const userMessage = `${file.name} upload failed.`;

    return (error: HttpErrorResponse) => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      const message = (error.error instanceof Error) ?
        error.error.message :
        `server returned code ${error.status} with body "${error.error}"`;

      this.messenger.add(file.name, {msg: `${userMessage} ${message}`});

      // Let app keep running but indicate failure.
      return of(userMessage);
    };
  }

  private showProgress(message: any) {
    this.messenger.add(message.file, message);

  }
}
