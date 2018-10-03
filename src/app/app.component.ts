import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, fromEvent} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'formValidation';
  password: string;
  email: string;
  passwordConformation: string;

  confirmPassInputSource$: any;
  emailInputSource$: any;
  passInputSource$: any;
  combineLatest$: any;
  formValid: any;

  emailErrorMessage = '';
  passwordErrorMessage = '';
  confirmPasswordErrorMessage = '';

  constructor() {
  }

  ngOnInit() {

    const elEmail = document.getElementsByName('email');
    const elPassword = document.getElementsByName('password');
    const elConfirmPassword = document.getElementsByName('passwordConformation');
    const emailRegExp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    this.emailInputSource$ = fromEvent(elEmail, 'blur')
      .pipe(
        map((event) => {
          return (event.currentTarget as HTMLInputElement).value;
        }),
        map((input: string) => {
          return emailRegExp.test(input);
        })
      );


    this.passInputSource$ = fromEvent(elPassword, 'blur')
      .pipe(
        map((event) => {
          return (event.currentTarget as HTMLInputElement).value;
        }),
        map((input: string) => {
          return input.length > 4;
        })
      );


    this.confirmPassInputSource$ = fromEvent(elConfirmPassword, 'blur')
      .pipe(
        map((event) => {
          return (event.currentTarget as HTMLInputElement).value;
        }),
        map((input) => {
          return input === this.password;
        })
      );

    this.emailInputSource$.subscribe((inputValid) => {
      if (inputValid) {
        this.emailErrorMessage = null;
      } else {
        this.emailErrorMessage = 'wrong mail format';
      }
    });

    this.passInputSource$.subscribe((inputValid) => {
      if (inputValid) {
        this.passwordErrorMessage = null;
      } else {
        this.passwordErrorMessage = 'password too short';
      }
    });

    this.confirmPassInputSource$.subscribe((inputValid) => {
      if (inputValid) {
        this.confirmPasswordErrorMessage = null;
      } else {
        this.confirmPasswordErrorMessage = 'password do not match';
      }
    });

    this.combineLatest$ = combineLatest(
      this.emailInputSource$,
      this.passInputSource$,
      this.confirmPassInputSource$,
      (s1, s2, s3) => {
        return s1 && s2 && s3;
      }
    )
      .subscribe((formValid) => {
        this.formValid = formValid;
      });

  }


  submit() {
    if (this.formValid) {
      alert(`Email: ${this.email} Password:${this.password}`);
    } else {
      alert('Please fill all fields correctly!');
    }

  }

  ngOnDestroy() {
    this.emailInputSource$.unsubscribe();
    this.passInputSource$.unsubscribe();
    this.confirmPassInputSource$.unsubscribe();
    this.combineLatest$.unsubscribe();
  }
}
