import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject, snapshotChanges } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  urlsRef: AngularFireList<any> = this.db.list('urlDataList');
  urlRef: AngularFireObject<any> = this.db.object('urlData');

  constructor(private db: AngularFireDatabase) { }


  // Add Url
  AddUrlData(originalUrl: string, shortenedUrl: string) {
    var lUrldData = {
      originalUrl: originalUrl,
      shortenedUrl: shortenedUrl
    }
    this.urlsRef.push(lUrldData);
  }

  /* Get UrlData */
  GetUrlData(id: string) {
    this.urlRef = this.db.object('urlDataList/' + id);
    return this.urlRef;
  }
  /* Get UrlList */
  GetUrlDataList() {
    return this.urlsRef;
  }

}
