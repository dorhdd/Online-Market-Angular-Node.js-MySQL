import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  ActivatedRoute,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IdService } from "src/app/identification/id.service";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class AddGuard implements CanActivate {
  constructor(
    private idService: IdService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.idService.isManager().pipe(
      map((resData) => {
        if (resData["manager"]) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
