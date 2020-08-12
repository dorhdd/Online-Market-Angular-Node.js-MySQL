import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class IdService {
  logStatus = new Subject<boolean>();
  userData = new Subject<string>();
  haveCart = new Subject<boolean>();
  isManagerSub = new Subject<boolean>();

  headers = new HttpHeaders().set(
    "Content-Type",
    "application/json; charset=utf-8"
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  login(email: string, password: string) {
    this.logStatus.next(true);
    return this.http.post("start/login", {
      email: email,
      password: password,
    });
  }

  isLogged() {
    return this.http.get<boolean | Promise<boolean> | Observable<boolean>>(
      "start/auth"
    );
  }

  logout() {
    return this.http
      .get("start/logout", { headers: this.headers })
      .subscribe((resData) => {
        if (resData["logoutOk"]) {
          this.router.navigate(["/"], { relativeTo: this.route });
          this.logStatus.next(false);
        }
      });
  }

  cartCheck() {
    return this.http.get("start/cartCheck").subscribe(
      (res) => {
        if (res["haveCart"]) {
          this.haveCart.next(true);
        }
        if (res["haveCart"] === false) {
          this.haveCart.next(false);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isManager() {
    return this.http.get("homePage/isManager");
  }

  ordersAmount() {
    return this.http.get("start/ordersAmount");
  }

  userOrdersAmount() {
    return this.http.get("start/userOrdersAmount");
  }

  availableProducts() {
    return this.http.get("start/availableProducts");
  }
}
