import {Component, Input, OnInit} from '@angular/core';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-errormodal',
  templateUrl: './errormodal.component.html',
  styleUrls: ['./errormodal.component.css',
    '../../../node_modules/open-iconic/font/css/open-iconic-bootstrap.min.css']
})
export class ErrormodalComponent implements OnInit {
  @Input() messenger: MessageService;
  constructor() { }

  ngOnInit(): void {
  }

}
