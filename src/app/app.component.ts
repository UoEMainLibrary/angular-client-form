import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
    '../../node_modules/bootstrap/dist/css/bootstrap.min.css', ]
})
export class AppComponent {
  title = 'Collecting Covid';
  uid = Math.round(Math.random() * 100);

  // messages: Map<string, string> = new Map<string, string>();

  onSubmit(form: NgForm) {
    console.log(form);
  }

}
