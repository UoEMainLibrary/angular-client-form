import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {MessageService} from './message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
    '../../node_modules/bootstrap/dist/css/bootstrap.min.css',
    '../../node_modules/open-iconic/font/css/open-iconic-bootstrap.min.css']
})
export class AppComponent {
  @ViewChild('fileUploadComponent') fileUploadComponent;
  @ViewChild('summaryElement') summaryElement: ElementRef;
  @ViewChild('form') form: ElementRef;
  recaptchaValue: string;
  summary: boolean;

  inputForm = this.fb.group({
    email: ['', Validators.required],
    name: ['', Validators.required],
    uid: [''],
    creator: ['', Validators.required],
    affiliation: ['', Validators.required],
    location: [''],
    description: ['', Validators.required],
    recaptchaReactive: [''],
    copy: ['', Validators.required],
    content: this.fb.group( {
      photos: [''],
      videos: [''],
      audio: [''],
      url: [''],
      text: [''],
      otherContentType: [''],
      urls: this.fb.array([])
    }, { validator: this.requireOneCheckboxToBeChecked }),
    additionalCreators: this.fb.array([
      this.fb.control('')
    ]),
  });

  //  this.fb.control('', [ Validators.required, Validators.minLength(7) ])


  humanFileSize(bytes, si= false, dp= 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }

    const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
  }

  requireOneCheckboxToBeChecked(g: FormGroup) {
    let checked = 0;

    Object.keys(g.controls).forEach(key => {
      const control = g.controls[key];

      if (control.value === true) {
        checked ++;
      }
    });


    Object.keys(g.controls).forEach(key => {
        const control = g.controls[key];

        if (checked < 1) {
          control.setErrors({oneCheckboxRequired: true});
        }
        else {
          control.setErrors(null);
        }

      });

    return false;
  }

  selectUrl() {
    if (this.urls.controls.length === 0) {
      this.addURL();
      this.messenger.upload = '';
    }
    else {
      while (this.urls.controls.length) {
        this.removeURL();
      }
    }
  }

  get content() {
    return this.inputForm.get('content') as FormGroup;
  }

  get additionalCreators() {
    return this.inputForm.get('additionalCreators') as FormArray;
  }

  addAdditionalCreator() {
    this.additionalCreators.push(this.fb.control(''));
  }

  removeAdditionalCreator() {
    this.additionalCreators.removeAt(this.additionalCreators.length - 1);
  }

  setUid(uid) {
    this.inputForm.controls.uid.setValue(uid);
  }

  get depositURL()  {
    return this.content.controls.url.value;
  }

  get urls() {
    return this.content.get('urls') as FormArray;
  }

  addURL() {
    this.urls.push(this.fb.control('', [ Validators.required ]));
  }

  removeURL() {
    this.urls.removeAt(this.urls.length - 1);
  }

  get otherValid() {
    return this.messenger.recaptchaFirst === '' && this.messenger.upload === '';
  }

  get isreCaptchaValid()  {
    return this.inputForm.controls.recaptchaReactive.valid && this.recaptchaValue;
  }

  isValid(control: string): boolean {
    return this.inputForm.controls[control].untouched || this.inputForm.controls[control].valid;
  }

  unCheck() {
    this.content.markAllAsTouched();
    if (this.findCheckedControls().length === 0 || this.content.controls.otherContentType.value === '') {
      this.messenger.upload = '';
    }
  }

  get isNotSoleCreator() {
    return this.inputForm.controls.creator.value === 'No';
  }

  get contentSummary()  {
    let summary = 'You are submitting ';
    const content = [];

    for ( const c of ['photos', 'videos', 'audio', 'text', 'url'] ) {
      if (this.content.controls[c].value)  {
        if (c === 'url') {
          if (this.urls.controls.length === 1) {
            content.push('a website URL');
          } else {
            content.push('website URLs');
          }
        }
        else {
          content.push(c);
        }
      }
    }

    if (this.content.controls.otherContentType.value !== '')  {
      content.push(this.content.controls.otherContentType.value);
    }

    if (content.length === 0)  {
      return '';
    }
    else if (content.length === 1)  {
      summary += content[0] + '.';
    }
    else {
      for (let i = 0; i < content.length - 1; i++) {
        summary += content[i] + ', ';
      }

      summary = summary.slice(0, summary.length - 2) + ' and ' + content[content.length - 1] + '.';

    }

    return summary;
  }

  constructor(private http: HttpClient, private fb: FormBuilder, public messenger: MessageService) {
    this.summary = false;
  }

  reset(scroll= false) {
    this.recaptchaValue = undefined;
    this.summary = false;
    this.messenger.recaptchaFirst = '';
    this.messenger.upload = '';
    this.inputForm.reset();
    this.urls.clear();
    this.messenger.reset();

    if (scroll) {
      this.form.nativeElement.scrollIntoView({behavior: 'smooth'});
    }

  }
 // https://lac-edwebtools.is.ed.ac.uk/cc
  recaptcha(event)  {
    this.http.get('https://lac-edwebtools.is.ed.ac.uk/cc/recaptcha/' + event)
      .subscribe( data => { this.setRecaptcha(data, event); }, error => { this.messenger.errors.push(error); });

  }

  setRecaptcha(data, event)  {
    if (data.success)  {
      this.recaptchaValue = event;
      this.messenger.recaptchaFirst = '';
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.inputForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  public findCheckedControls() {
    const checked = [];
    const controls = this.content.controls;
    for (const name in controls) {
      if (name !== 'url' && controls[name].value === true) {
        checked.push(name);
      }
    }
    return checked;
  }

  confirmDeposit() {
    if (!this.summary) {
      // Clear past errors
      this.messenger.errors = [];

      // Submission attempted, treat as traversed
      this.inputForm.markAllAsTouched();

      // Check if files are uploaded
      if ((!this.content.controls.url.value || this.findCheckedControls().length > 0) && this.messenger.completed === 0) {
        this.messenger.upload = 'Please either upload one or more files or fill in one or more URLs.';
      }

      // Check if recaptcha has been done
      if (!this.isreCaptchaValid) {
        this.messenger.recaptchaFirst = 'Before uploading files, please validate yourself as being human using the reCaptcha at the bottom of the form.';
      }

      if (this.inputForm.valid && this.otherValid)  {
        this.summary = true;
        setTimeout(() => this.summaryElement.nativeElement.scrollIntoView({behavior: 'smooth'}), 50);

      }
      else {
        const invalids = this.findInvalidControls();

        if (invalids.length > 2 || invalids.indexOf('copy') === -1) {
          this.form.nativeElement.scrollIntoView({behavior: 'smooth'});
        }
      }

    }
    else {
      this.http.post('https://lac-edwebtools.is.ed.ac.uk/cc/api/',
        JSON.stringify(this.inputForm.value))
        .subscribe(resp => { this.handleResponse(resp); },
        error => this.messenger.errors.push(error));

    }

  }

  handleResponse(resp)  {
    if (resp.success) {
      this.reset();
      this.messenger.success = 'You will get a confirmation email with further details.';
      setTimeout(() => { this.messenger.success = ''; this.summary = false; }, 5000);
    }
  }
}
