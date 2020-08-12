import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SignInService } from "../sign-in.service";

@Component({
  selector: "app-id-details",
  templateUrl: "./id-details.component.html",
  styleUrls: ["./id-details.component.css"],
})
export class IdDetailsComponent implements OnInit {
  signInForm: FormGroup;
  idEXistError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signInService: SignInService
  ) {}

  ngOnInit(): void {
    this.signForm();
  }

  private signForm() {
    let userId = null;
    let userEmail = null;
    let userpassword = null;
    let userPasswordConfirm = null;

    this.signInForm = new FormGroup(
      {
        id: new FormControl(userId, [
          Validators.required,
          this.onIdChecking.bind(this),
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
        email: new FormControl(userEmail, [
          Validators.required,
          Validators.email,
        ]),
        password: new FormControl(userpassword, Validators.required),
        passwordConfirm: new FormControl(
          userPasswordConfirm,
          Validators.required
        ),
      },
      {
        validators: this.passwordMatchError.bind(this),
      }
    );
  }

  onSubmit() {
    const fd = this.signInForm.value;
    this.signInService.idDetails = {
      id: fd.id,
      email: fd.email,
      password: fd.password,
    };
    this.router.navigate(["personal"], { relativeTo: this.route });
  }

  passwordMatchError(formGroup: FormGroup) {
    const { value: password } = formGroup.get("password");
    const { value: passwordConfirm } = formGroup.get("passwordConfirm");
    return password === passwordConfirm ? null : { passwordNotMatch: true };
  }

  onIdChecking(control: FormControl): { [s: string]: boolean } {
    this.signInService.idCheck(control.value).subscribe(
      (resData) => {
        if (resData["idExist"] === true) {
          this.idEXistError = true;
        } else {
          this.idEXistError = false;
        }
      },
      (error) => {
        console.log(error);
      }
    );

    if (this.idEXistError === true) {
      return { idError: true };
    }
    return null;
  }
}
