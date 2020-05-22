import {Component, Input, OnInit} from '@angular/core';

import { MessageService } from '../message.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-additional-creator',
  templateUrl: './additional-creator.component.html',
  styleUrls: ['./additional-creator.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.min.css',
    '../../../node_modules/open-iconic/font/css/open-iconic-bootstrap.min.css']
})
export class AdditionalCreatorComponent implements OnInit {
  @Input() messenger: MessageService;
  @Input() id: number;
  fc: FormControl;

  constructor() {
    this.fc = new FormControl();
  }

  addCreator() {
    //this.messenger.additionalcreators.push(this.messenger.additionalcreators.length + 1);
  }

  removeCreator() {
      //this.messenger.additionalcreators.pop();
  }

  ngOnInit(): void {}

}
