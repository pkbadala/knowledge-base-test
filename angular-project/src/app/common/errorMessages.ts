import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {messages} from './errorMessagesData';
@Injectable()
export class ErrorMessages {
  public MSG = (<any>messages)

  constructor() {}
  getError(field, error) {
    let message = '';
    if (error) {
        if (error.required) {
          const required = this.MSG.ERROR.REQUIRED;
          switch (field) {
            case "username":
              {
                message = required.Username;
              }
              break;
            case "email":
              {
                message = required.Email;
              }
              break;

            case "mobile":
              {
                message = required.mobile;
              }
              break;
            case "password":
              {
                message = required.Password;
              }
              break;
            case "currentPassword":
              {
                message = required.currentPassword;
              }
              break;
            case "newPassword":
              {
                message = required.newPassword;
              }
              break;
            case "confirmPassword":
              {
                message = required.confirmPassword;
              }
              break;
            case "activity":
              {
                message = required.activity;
              }
              break;
            case "remark":
              {
                message = required.remark;
              }
              break;


            case "firstname":
              {
                message = required.firstname;
              }
              break;
            case "lastname":
              {
                message = required.lastname;
              }
              break;

            case "technology":
              {
                message = required.technology;
              }
              break;
          }
        } else if (error.pattern) {
          const pattern = this.MSG.ERROR.PATTERN;
          switch (field) {
            case 'email' : { message = pattern.Email } break;
          }
        } else if (error.minlength) {
          const minlength = this.MSG.ERROR.MINLENGTH;
          switch (field) {
            case 'mobile' : { message = minlength.mobile } break;
          }
        }
        return message;
      }
    }
  }
