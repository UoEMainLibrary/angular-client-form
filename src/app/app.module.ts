import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MessageService } from './message.service';
import { AdditionalCreatorComponent } from './additional-creator/additional-creator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrormodalComponent } from './errormodal/errormodal.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FileUploadComponent,
    AdditionalCreatorComponent,
    ErrormodalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  providers: [ MessageService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
