import {Component, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessageService} from './message.service';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
    '../../node_modules/bootstrap/dist/css/bootstrap.min.css',
    '../../node_modules/open-iconic/font/css/open-iconic-bootstrap.min.css']
})
export class AppComponent {
  @ViewChild('fileUploadComponent') fileUploadComponent;
  recaptchaValue: string;

  inputForm = this.fb.group({
    email: ['', Validators.required],
    name: ['', Validators.required],
    uid: [''],
    creator: ['', Validators.required],
    affiliation: ['', Validators.required],
    location: [''],
    description: ['', Validators.required],
    otherContentType: [''],
    recaptchaReactive: [''],
    content_type_photos: [''],
    content_type_videos: [''],
    content_type_audio: [''],
    content_type_url: [''],
    content_type_text: [''],
    other_content_type: [''],
    copy: ['', Validators.required],
    content: this.fb.group( {
      photos: [''],
      videos: [''],
      audio: [''],
      url: [''],
      text: [''],
    }),
    additionalCreators: this.fb.array([
      this.fb.control('')
    ]),
    urls: this.fb.array([
      this.fb.control('')
    ])
  });

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
    return this.inputForm.controls.content_type_url.value;
  }

  get urls() {
    return this.inputForm.get('urls') as FormArray;
  }

  addURL() {
    this.urls.push(this.fb.control(''));
  }

  removeURL() {
    this.urls.removeAt(this.urls.length - 1);
  }

  get isreCaptchaValid()  {
    return this.inputForm.controls.recaptchaReactive.valid && this.recaptchaValue;
  }

  get isNameValid() {
    return this.inputForm.controls.name.untouched || this.inputForm.controls.name.valid;
  }

  get isEmailValid() {
    return this.inputForm.controls.email.untouched || this.inputForm.controls.email.valid;
  }

  get urlNotEmpty() {
    return this.inputForm.controls.content_type_url.value && this.urls.controls[0].value ==! '';
  }

  get contentSelected() {
    return this.inputForm.controls.content_type_photos.value || this.inputForm.controls.content_type_videos.value ||
      this.inputForm.controls.content_type_audio.value || this.urlNotEmpty ||
      this.inputForm.controls.content_type_text.value || this.inputForm.controls.other_content_type.value;
  }

  get isNotSoleCreator() {
    return this.inputForm.controls.creator.value === 'No';
  }

  constructor(private http: HttpClient, private fb: FormBuilder, public messenger: MessageService) { }

  reset(resp) {
    if (resp.success) {
      this.recaptchaValue = undefined;
      this.inputForm.reset();
      this.messenger.reset();
    }
  }

  recaptcha(event)  {
    this.http.get('http://localhost:5000/recaptcha/' + event).subscribe( data => this.setRecaptcha(data, event),);

  }

  setRecaptcha(data, event)  {
    if(data.success)  {
      this.recaptchaValue = event;
    }
  }

  clickSubmit()  {
    // Clear past errors
    this.messenger.errors = [];

    // Submission attempted, treat as traversed
    this.inputForm.markAllAsTouched();

    // Check if files are uploaded
    if (this.messenger.completed === 0) {
      this.messenger.errors.push(new Error('You haven\'t uploaded any files.'));
    }

    // Check if recaptcha has been done
    if (!this.isreCaptchaValid) {
      this.messenger.errors.push(new Error('You haven\'t validated yourself as being human.'));
    }

    if (this.inputForm.valid)  {
      this.http.post('http://localhost:5000/api/', JSON.stringify(this.inputForm.value)).subscribe(resp => { this.reset(resp); },
        error => this.messenger.errors.push(error));
      console.log(JSON.stringify(this.inputForm.value));

    }

  }

}
