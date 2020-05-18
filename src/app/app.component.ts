import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {MessageService} from './message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
    '../../node_modules/bootstrap/dist/css/bootstrap.min.css', ]
})
export class AppComponent {
  @ViewChild('f') f;
  @ViewChild('fileUploadComponent') fileUploadComponent;
  title: string;
  uid: number;
  creator: string;
  affiliation: string;
  location: string;
  description: string;
  other_content_type: string;
  captcha = null;

  constructor(private http: HttpClient, public messenger: MessageService) {
    this.reset();
    this.messenger.defaultvalues.set('affiliation', this.affiliation);
    this.messenger.defaultvalues.set('location', this.location);
    this.messenger.defaultvalues.set('description', this.description);
    this.messenger.defaultvalues.set('other_content_type', this.other_content_type);

  }

  reset() {
    this.title = 'Collecting Covid';
    this.uid = 0;
    this.creator = '';
    this.affiliation = '(e.g. 1st year veterinary student, language assistant, lecturer in biological sciences, project assistant, caterer, academic librarian, cleaner…)';
    this.location = 'In Edinburgh, the UK, another part of the world?';
    this.description = 'Please describe the material including locations, events, dates.';
    this.other_content_type = '';
    this.captcha = null;
  }

  setUid(uid: number) {
    this.uid = uid;
  }

  resetForm(form) {
    for (const fcname in form.controls) {
      const fc = form.controls[fcname.valueOf()];
      fc.enable();

      if (!this.messenger.defaultvalues.has(fcname.valueOf())) {
        fc.reset();
      }
      else {
        fc.reset();
        fc.value = this.messenger.defaultvalues.get(fcname.valueOf());
      }

    }

    // Which one should come first?
    // should both be called?
    this.fileUploadComponent.reset();
    this.reset();
    window.location.reload();
  }

  clickSubmit(form: NgForm, form2: NgForm)  {
    this.messenger.errors = [];
    form.control.markAllAsTouched();

    if (this.messenger.completed === 0) {
      this.messenger.errors.push(new Error('You haven\'t uploaded any files.'));
    }

    if (!form2.valid) {
      this.messenger.errors.push(new Error('You haven\'t validated yourself as being human.'));
    }
    else if (form.valid && this.messenger.completed > 0)  {
      // Disable optional inputs left untouched

      for (const fcname in form.controls) {
        if (this.messenger.defaultvalues.has(fcname.valueOf()))  {
          const fc = form.controls[fcname.valueOf()];

          if (fc.value === this.messenger.defaultvalues.get(fcname.valueOf())) {
            fc.disable();
          }
        }

      }

      const formData = new FormData(document.forms[0]);
      const success = 'success';
      this.http.post('http://127.0.0.1:5000/api/', formData).subscribe(resp => { if (resp[success]) {  window.location.reload(); } },
        error => this.messenger.errors.push(error));

    }

  }

}
