import {Component, OnInit} from '@angular/core';
import {combineLatest, fromEvent, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'formValidation';
  confirmPassInputSource$: any;
  emailInputSource$: any;
  passInputSource$: any;
  validEmail$: any;
  validPass$: any;
  validConfirmPass$: any;
  emailErrorMessage: string;
  passwordErrorMessage: string;
  confirmPasswordErrorMessage: string;

  constructor() {
  }

  ngOnInit() {

    const elEmail = document.getElementsByName('email');
    const elPassword = document.getElementsByName('password');
    const elConfirmPassword = document.getElementsByName('password');

    this.emailInputSource$ = fromEvent(elEmail, 'blur')
      .pipe(
        map((events) => {
          return (event.currentTarget as HTMLInputElement).value;
        })
      );


    this.passInputSource$ = fromEvent(elPassword, 'blur')
      .pipe(
        map( (events) => {
          return (event.currentTarget as HTMLInputElement).value;
        })
      );


    this.confirmPassInputSource$ = fromEvent(elConfirmPassword, 'blur')
      .pipe(
        map( (events) => {
          return (event.currentTarget as HTMLInputElement).value;
        })
      );

    this.validEmail$ = this.emailInputSource$.map((input: string) => {
      return input.length > 0;
    });

    this.validPass$ = this.passInputSource$.map((input) => {
      return input.length && input.length > 4;
    });

    this.validConfirmPass$ = this.confirmPassInputSource$.map((input) => {
      console.error(this.passInputSource$);
      return input === this.passInputSource$;
    });


    this.emailInputSource$.subscribe((inputValid) => {
      if (!inputValid) {
        console.log('wrong mail format');
        this.emailErrorMessage = 'wrong mail format';
      } else {
        this.emailErrorMessage = '';
      }
    });

    this.passInputSource$.subscribe((inputValid) => {
      if (!inputValid) {
        console.log('password too short');
        this.passwordErrorMessage = 'password too short';
      } else {
        this.passwordErrorMessage = '';
      }
    });

    this.confirmPassInputSource$.subscribe((inputValid) => {
      if (!inputValid) {
        console.log('password do not match');
        this.confirmPasswordErrorMessage = 'password do not match';
      } else {
        this.confirmPasswordErrorMessage = '';
      }
    });

  }


  submit() {
    console.log('click');
    combineLatest(
      this.emailInputSource$,
      this.passInputSource$,
      this.confirmPassInputSource$,
      function (s1, s2, s3) {
        return s1 && s2 && s3;
      }
    )
      .subscribe(function (formValid) {
        console.log(formValid);
        if (formValid) {
          alert('VALID');
        } else {
          alert('INVALID');
        }
      });
  }
}
