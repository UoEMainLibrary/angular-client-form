import { Injectable } from '@angular/core';
import {
  HttpClient, HttpEvent, HttpEventType, HttpProgressEvent,
  HttpRequest, HttpResponse, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';

import { of } from 'rxjs';
import {catchError, last, map, tap} from 'rxjs/operators';

import { MessageService } from '../message.service';

@Injectable()
export class UploaderService {
  public messenger: MessageService;
  constructor(
    private http: HttpClient) {}

  upload(messenger: MessageService, uid: string, file: File) {
    if (!File) { return; }
    this.messenger = messenger;
    this.messenger.upload = '';

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('uid', uid);

    const req = new HttpRequest('POST',
      'https://lac-edwebtools.is.ed.ac.uk/cc/api/',
      formData,
      {reportProgress: true, responseType: 'json'});

    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file)),
      tap(message => this.showProgress(message)),
      last(), // return last (completed) message to caller
      catchError(this.handleError(file))
    );
  }

  /** Return distinct message for sent, upload progress, & response events */
  private getEventMessage(event: HttpEvent<any>, file: File) {
    const obj = { file: file.name,
      size: file.size,
      event: event.type,
      msg: '',
      percent: 100,
      body: null };

    switch (event.type) {
      case HttpEventType.Sent:
        obj.msg = `Uploading "${file.name}" of size ${file.size}.`;
        break;
      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        obj.percent = Math.floor(100 * event.loaded / event.total);

        if(obj.percent === 100) {
          obj.percent -= 1;
        }

        obj.msg = `"${file.name}" is ${obj.percent}% uploaded.`;
        break;
      case HttpEventType.Response:
        this.messenger.completed += 1;
        this.messenger.uploadMessage = `Uploaded ${this.messenger.completed} / ${this.messenger.messages.size}`;
        // obj.percent = 100;
        obj.body = event.body;
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

      this.messenger.errors.push(error);

      // Let app keep running but indicate failure.
      return of(userMessage);
    };
  }

  private showProgress(message: any) {
    this.messenger.add(message.file, message);

  }

}
