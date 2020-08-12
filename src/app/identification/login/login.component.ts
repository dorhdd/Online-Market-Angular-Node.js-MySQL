import { Component, OnInit, HostBinding, HostListener } from "@angular/core";
import { IdService } from "../id.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  wrongUserOrPass = false;
  isLoading = false;
  isLoggedIn = false;
  haveCart = false;
  firstShopping = false;

  userName = "";

  constructor(
    private idService: IdService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //pass user data if his loggin
    this.idService.isLogged().subscribe(
      (resData) => {
        if (resData["userDatails"]) {
          this.idService.userData.next(resData["userDatails"].name);
          this.idService.logStatus.next(true);
        }
      },
      (error) => {
        console.log(error);
      }
    );
    //check if loggin or not
    this.idService.logStatus.subscribe((status) => {
      this.isLoggedIn = status;
    });
    this.idService.haveCart.subscribe((status) => {
      this.haveCart = status;
    });
    this.logForm();
  }

  private logForm() {
    let email = null;
    let password = null;

    this.loginForm = new FormGroup({
      email: new FormControl(email, [Validators.required, Validators.email]),
      password: new FormControl(password, Validators.required),
    });
  }

  onSubmit() {
    this.isLoading = true;
    const lf = this.loginForm.value;
    this.idService.login(lf.email, lf.password).subscribe(
      (resData) => {
        if (resData["loginOk"]) {
          this.idService.userData.next(resData["name"]);
          this.userName = resData["name"];
          this.onCartCheck();
          this.onUserOrderAmounts();
          this.onManagerCheck();
        }
        if (resData["loginOk"] === false) {
          this.wrongUserOrPass = true;
        }
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onChange() {
    this.wrongUserOrPass = false;
  }

  onStartShopping() {
    this.router.navigate(["home"], { relativeTo: this.route });
  }

  onCartCheck() {
    this.idService.cartCheck();
  }
  onManagerCheck() {
    this.idService.isManager().subscribe(
      (res) => {
        if (res["manager"] === 1) {
          this.idService.isManagerSub.next(true);
          this.router.navigate(["addProduct"], { relativeTo: this.route });
        } else {
          this.idService.isManagerSub.next(false);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onUserOrderAmounts() {
    this.idService.userOrdersAmount().subscribe(
      (data) => {
        if (data["userOrdersAmount"] === 0) {
          this.firstShopping = true;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
