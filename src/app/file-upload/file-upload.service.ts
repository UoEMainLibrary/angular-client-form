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
  public completed;
  constructor(
    private http: HttpClient) {}

  upload(messenger: MessageService, file: File) {
    if (!File) { return; }
    this.messenger = messenger;
    this.completed = 0;

    const formData = new FormData();
    formData.append('file', file, file.name);

    const req = new HttpRequest('POST', 'http://127.0.0.1:8081/api/', formData, {reportProgress: true}, );

    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file)),
      tap(message => this.showProgress(message)),
      last(), // return last (completed) message to caller
      catchError(this.handleError(file))
    );
  }

  /** Return distinct message for sent, upload progress, & response events */
  private getEventMessage(event: HttpEvent<any>, file: File) {
    // console.log(event);
    switch (event.type) {
      case HttpEventType.Sent:
        return { file: file.name, msg: `Uploading file "${file.name}" of size ${file.size}.` };

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total);
        return { file: file.name, msg: `File "${file.name}" is ${percentDone}% uploaded.` };

      case HttpEventType.Response:
        this.completed += 1;
        return { file: file.name, msg: `File "${file.name}" was completely uploaded!` };

      default:
        return { file: file.name, msg: `File "${file.name}" surprising upload event: ${event.type}.`};
    }
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

      this.messenger.add(file.name, `${userMessage} ${message}`);

      // Let app keep running but indicate failure.
      return of(userMessage);
    };
  }

  private showProgress(message: any) {
    this.messenger.add(message.file, message.msg);

  }
}
