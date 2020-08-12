import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IdService } from "../id.service";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private idService: IdService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.idService.isLogged().pipe(
      map((resData) => {
        if (resData["isLoggedIn"]) {
          this.idService.userData.next(resData["userDatails"].name);
          this.idService.logStatus.next(resData["isLoggedIn"]);
          return true;
        } else {
          this.router.navigate(["/"]);
          return false;
        }
      })
    );
  }
}
