import { Component, PLATFORM_ID, Injectable, NgZone, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { BaseComponent } from './../common/commonComponent';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { config } from '../../assets/config/configs';
import swal from 'sweetalert2';
declare var window: any;
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
// import { isObjectEmpty } from 'ngx-bootstrap/chronos/utils/type-checks';
import * as awsapigatewayclient from 'aws-api-gateway-client';
declare const $: any;

@Injectable({
  providedIn: "root"
})
export class CommonService {
  authorised: any = false;
  public swal = swal;
  public config = <any>config;
  public _apiUrl = "";
  public platformId;

  constructor(
    public _http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.platformId = platformId;
    this._apiUrl = this.config.apiAWSUrl;
  }

  public getToken(key) {
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.getItem(key);
    }
  }
  public setToken(key, value) {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(key, value);
    }
  }
  /*******************************************************************************************
      @PURPOSE      	: 	Call api.
      @Parameters 	: 	{
            url : <url of api>
            data : <data object (JSON)>
            method : String (get, post)
            isForm (Optional) : Boolean - to call api with form data
            isPublic (Optional) : Boolean - to call api without auth header
          }
  /*****************************************************************************************/
  callApi(url, data, method, isPublic?): Promise<any> {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();

      if (isPublic) {
        headers = new HttpHeaders({ 'content-Type': 'application/json' });
      } else {
        if(this.getToken('authToken')) {
          headers = new HttpHeaders({ 'content-Type': 'application/json', 'Authorization': this.getToken('authToken') });          
        } else {
          this.router.navigate(['/']);
        }
        
      }

      if (method === "post") {
        this._http.post(this.config.apiUrl + url, data, { headers }).subscribe(
          data1 => {
            resolve(data1);
          },
          error => {
            this.showServerError(error);
          }
        );
      } else if (method === 'get') {
        this._http
          .get(this.config.apiUrl + url, { headers })
          .subscribe(
            data1 => {
              resolve(data1);
            },
            error => {
              this.showServerError(error);
            }
        );
      } else if (method === "put") {
        this._http.put(this.config.apiUrl + url, data, { headers }).subscribe(
          data1 => {
            resolve(data1);
          },
          error => {
            this.showServerError(error);
          }
        );
      } else if (method === "delete") {
        this._http.delete(this.config.apiUrl + url, { headers }).subscribe(
          data1 => {
            resolve(data1);
          },
          error => {
            this.showServerError(error);
          }
        );
      }
    });
  }

  /*******************************************************************************************
    upload image using call this api.
  /*****************************************************************************************/
  callImageUploadApi(url, data, method): Promise<any> {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();

      headers = new HttpHeaders({ 'Authorization': this.getToken('authToken') });
      
      if (method === "post") {
        this._http.post(this.config.apiUrl + url, data, { headers }).subscribe(
          data1 => {
            resolve(data1);
          },
          error => {
            this.showServerError(error);
          }
        );
      }
    });
  }

  /*****************************************************************************************/
  // @PURPOSE      	: 	To show server error
  /*****************************************************************************************/
  showServerError(e) {
    this.swal({
      position: 'center',
      type: 'error',
      text: 'Internal Server Error',
      showConfirmButton: false,
      timer: 1800,
      customClass: 'custom-toaster'
    });
    console.log('Internal server error', e);
  }
}


