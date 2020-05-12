import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
    '../../node_modules/bootstrap/dist/css/bootstrap.min.css', ]
})
export class AppComponent {
  @ViewChild('f') f;
  title = 'Collecting Covid';
  uid = Math.round(Math.random() * 100);
  creator = '';
  contentType = '';
  affiliation = '(e.g. 1st year veterinary student, language assistant, lecturer in biological sciences, project assistant, caterer, academic librarian, cleaner…)';
  location = 'In Edinburgh, the UK, another part of the world? ';
  description = 'Please describe the material including locations, events, dates.';
  defaultValues = new Map();

  constructor(private http: HttpClient) {
    this.defaultValues.set('affiliation', this.affiliation);
    this.defaultValues.set('location', this.location);
    this.defaultValues.set('description', this.description);
  }

  onChange(value)  {
    this.contentType = value;
  }

  checkClass()  {
    if( this.affiliation === '' ) {
      return 'form-control';
    }

    return 'form-control lighter-text';
  }

  onFocus()  {
    console.log('a');
  }

  onSubmit(form: NgForm) {
    // console.log(this);
    // const formData = new FormData(form.value);
    const formData = new FormData(document.forms[0]);
    this.http.post('http://127.0.0.1:5000/api/', formData).subscribe();
  }

}
