import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgTinyUrlService } from 'ng-tiny-url';
import { CrudService } from './shared/crud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Shorten/Inflate Url';
  shortForm: FormGroup;
  toshorten = true;
  shortenedUrl = '';
  originalUrl = '';

  constructor(private formBuilder: FormBuilder, private tinyUrl: NgTinyUrlService, public firebasecrud: CrudService) {
    this.shortForm = formBuilder.group({
      short: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      inflate: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]]
    })
  }

  get m(){
    return this.shortForm.controls;
  }

  shorten(): void {
    //shorten url and add to database
    this.tinyUrl.shorten(this.shortForm.value['short']).subscribe(res => {
      this.firebasecrud.AddUrlData(this.shortForm.value['short'], res);
      this.toshorten = false;
      this.shortenedUrl = res;
      this.shortForm.reset();
    });
  }

  inflate(): void {
    //get original url from firebase
    this.firebasecrud.GetUrlDataList()
    .query.orderByChild("shortenedUrl").equalTo(this.shortForm.value['inflate']).limitToFirst(1).on("value", (snap)=> {
      if (snap.val() == null){
        window.alert("Shortened Url does not exists.");
      }
      snap.forEach((data) => {
        this.originalUrl = data.val().originalUrl;
        window.alert("Original Url: " + this.originalUrl);
      });
    })
  }

}
