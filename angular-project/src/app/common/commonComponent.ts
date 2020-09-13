import { APP_ID, Component, HostListener, Injector, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonService } from './common.service';
import { ErrorMessages } from './errorMessages';
import { HttpClient } from '@angular/common/http';
// import { BsModalService } from 'ngx-bootstrap/modal'; 

import swal from 'sweetalert2';
import * as jQuery from 'jquery';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'parent-comp',
  template: '',
  providers: []
})

export class BaseComponent {
  public ranNums = [];
  constructor(injector: Injector) {
    this.router = injector.get(Router)
    this.platformId = injector.get(PLATFORM_ID)
    this.appId = injector.get(APP_ID)
    this.commonService = injector.get(CommonService)
    this.errorMessage = injector.get(ErrorMessages)
    this.titleService = injector.get(Title)
    this.activatedRoute = injector.get(ActivatedRoute)
    this.baseUrl = this.commonService._apiUrl; 
  }
  public activatedRoute: ActivatedRoute;
  public errorMessage: ErrorMessages
  // public modalService: BsModalService
  // public swal = swal;
  public titleService: Title
  public platformId: any;
  public appId: any;
  // public http = this.http;
  public router: Router;
  public commonService: CommonService;
  public baseUrl;
  public $ = jQuery; 
  public demoSiteKey = "6Ld6-gkUAAAAAIVMcuCg1VMuMmBJexC7FwMsntLY";
  public showHeaderFooter = true;
  public ShowPopuponScroll: boolean = false;
  public isShow: boolean;
  public topPosToStartShowing = 100;
  public defaultImage = 'assets/images/default.png';
  // public BsModalRef : BsModalRef;

  // *************************************************************//
  //@Purpose : To check server or browser
  //*************************************************************//
  isBrowser() {
    if (isPlatformBrowser(this.platformId)) {
      return true;
    } else {
      return false;
    }
  }
  getRandomInt(imageLength) {
    var number = [];
    for (var k = 0; k < imageLength; k++) {
      number.push(k);
    }

    var i = number.length,
      j = 0;
    while (i--) {
      j = Math.floor(Math.random() * (i + 1));
      this.ranNums.push(number[j]);
      number.splice(j, 1);
    }
    this.ranNums.splice(3, (imageLength));
  }

  // *************************************************************//
  //@Purpose : We can use following function to use localstorage
  //*************************************************************//
  setToken(key, value) {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(key, value);
    }
  }
  getToken(key) {
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.getItem(key);
    }
  }
  removeToken(key) {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.removeItem(key);
    }
  }
  clearToken() {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.clear()
    }
  }
  setDataInLS(key, value) {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(key, value);
    }
  }
  getDataInLS(key) {
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.getItem(key);
    }
  }
  //*************************************************************//

  //*************************************************************//
  //@Purpose : We can use following function to use Toaster Service.
  //*************************************************************//
  popToast(type, title) {
    swal({
      position: 'center',
      type: type,
      text: title,
      showConfirmButton: false,
      timer: 3000,
      customClass: 'custom-toaster'
    })
  }

  /****************************************************************************
  @PURPOSE      : To restrict or allow some values in input.
  @PARAMETERS   : $event
  @RETURN       : Boolen
  ****************************************************************************/
  RestrictSpace(e) {
    if (e.keyCode == 32) {
      return false;
    } else {
      return true;
    }
  }

  AllowNumbers(e) {
    var input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    if (e.which === 43 || e.which === 45) {
      return true;
    }
    if (e.which === 36 || e.which === 35) {
      return true;
    }
    if (e.which === 37 || e.which === 39) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  }

  AllowChar(e) {
    if ((e.keyCode > 64 && e.keyCode < 91) || (e.keyCode > 96 && e.keyCode < 123) || e.keyCode == 8) {
      return true
    } else {
      return false
    }
  }

  AllowNumbersOnly(event) {
    let a = event.charCode;
    if ((a > 47 && a < 58)) {
      return true;
    } else {
      return false;
    }
  }
  /****************************************************************************/


  /****************************************************************************/
  //@Logout
  /****************************************************************************/
  logout() {
    var temp = {
      ss_id: '',
      ss_pass: '',
      remember: false
    };
    if (this.getToken('ss_id') && this.getToken('ss_pass')) {
      temp.ss_id = this.getToken('ss_id')
      temp.ss_pass = this.getToken('ss_pass')
      temp.remember = true;
    }
    this.clearToken()
    //console.log("temp", temp)
    if (temp.remember) {
      this.setToken('ss_id', temp.ss_id);
      this.setToken('ss_pass', temp.ss_pass);
    }
    this.router.navigate(["/"]);
  }
  /****************************************************************************/

  /****************************************************************************
  @PURPOSE      : To show validation message
  @PARAMETERS   : <field_name, errorObj?>
  @RETURN       : error message.
  ****************************************************************************/
  showError(field, errorObj?) {
    return this.errorMessage.getError(field, errorObj)
  }
  /****************************************************************************/
  getProfile() {
    const url = this.getToken("ss_pic");
    if (url == null || url === ' ') {
      return 'assets/images/NoProfile.png'
    } else {
      return url;
    }
  }

  ngOnInit() {
    if (this.isBrowser()) {
      window.scrollTo(0, 0);
    }
  }

  ngAfterViewInit() {
  }
}
