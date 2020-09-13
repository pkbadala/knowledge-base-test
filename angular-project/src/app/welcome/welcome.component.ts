import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../common/commonComponent';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  AuthService,
  GoogleLoginProvider
} from 'angular-6-social-login';

declare var $: any;
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent extends BaseComponent implements OnInit {

  public showSignUp: boolean = true;
  public loginForm: FormGroup;
  public signUpForm: FormGroup;

  constructor(public injector: Injector, private formBuilder: FormBuilder, private toaster: ToastrService, private socialAuthService: AuthService) { 
    super(injector);
    
    this.signUpForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }

  switchSignUpORSignIn() {
    this.showSignUp = !this.showSignUp;
  }
  
  // registration process
  submittedSignUpForm() {    
    let formValid = this.checkAllRequiredFieldValues(this.signUpForm.value, 'Registration');
    if(this.signUpForm.valid && formValid) {
      this.commonService.callApi('registration/', this.signUpForm.value, 'post', true).then(response => {
        if(response.status === 1) {
          this.toaster.success(response.message, 'Registration');
          this.setToken('authToken', response.data.accessToken);
          this.setDataInLS('userId', response.data.userId);
          this.router.navigate(['/home']);
        } else {
          this.toaster.error(response.message, 'Login');
        }
      });
    }
  }

  // login process
  submittedLoginForm() {    
    let formValid = this.checkAllRequiredFieldValues(this.loginForm.value, 'Login');
    if(this.loginForm.valid && formValid) {
      this.commonService.callApi('login/', this.loginForm.value, 'post', true).then(response => {
        if(response.status === 1) {
          this.toaster.success(response.message, 'Login');
          this.setToken('authToken', response.data.accessToken);
          this.setDataInLS('userId', response.data.userId);
          this.router.navigate(['/home']);
        } else {
          this.toaster.error(response.message, 'Login');
        }
      });
    }
  }

  public SignUpWithGoogle() {
    let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        let data = {
          userName : userData.name,
          email : userData.email,
          googleId : userData.id,
          googleIdToken : userData.idToken,
          googleToken : userData.token
        };

        this.commonService.callApi('registrationWithGoogle/', data, 'post', true).then(response => {
          if(response.status === 1) {
            this.toaster.success(response.message, 'Registration');
            this.setToken('authToken', response.data.accessToken);
            this.setDataInLS('userId', response.data.userId);
            this.router.navigate(['/home']);
          } else {
            this.toaster.error(response.message, 'Login');
          }
        });
      }
    );
  }

  public SignInWithGoogle() {
    let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        let data = {
          userName : userData.name,
          email : userData.email,
          googleId : userData.id,
          googleIdToken : userData.idToken,
          googleToken : userData.token
        };

        this.commonService.callApi('signInWithGoogle/', data, 'post', true).then(response => {
          if(response.status === 1) {
            this.toaster.success(response.message, 'Registration');
            this.setToken('authToken', response.data.accessToken);
            this.setDataInLS('userId', response.data.userId);
            this.router.navigate(['/home']);
          } else {
            this.toaster.error(response.message, 'Login');
          }
        });
      }
    );
  }

 // check all required data is fill or not
  checkAllRequiredFieldValues(data, title) {
    const keyArr = Object.keys(data);
    const valueArr = Object.values(data);

    for (let i = 0; i < keyArr.length; i++) {
      if (valueArr[i] === null || valueArr[i] === '' || valueArr[i] === false) {

        keyArr[i] = keyArr[i].replace(/([A-Z])/g, ' $1').trim().toLowerCase();
        keyArr[i] = keyArr[i].replace('required', '');
        this.toaster.error(keyArr[i] + ' field is required', title);
        return false;
      }
    }
    return true;
  }
}
