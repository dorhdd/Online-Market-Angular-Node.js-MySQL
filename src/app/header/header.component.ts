import { Component, OnInit, OnDestroy } from "@angular/core";
import { IdService } from "../identification/id.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName: string;
  loginSub: Subscription;
  userDataSub: Subscription;
  isLoggedIn = false;
  isManager = false;

  constructor(private idService: IdService) {}

  ngOnInit() {
    this.onManagerCheck();

    this.loginSub = this.idService.logStatus.subscribe((data) => {
      this.isLoggedIn = data;
    });
    this.userDataSub = this.idService.userData.subscribe((data) => {
      this.userName = data;
    });
  }

  onLogout() {
    this.isManager = false;
    this.idService.logout();
  }

  onManagerCheck() {
    this.idService.isManager().subscribe(
      (res) => {
        if (res["manager"] === 1) {

          this.isManager = true;
        } else {
          this.isManager = false;
        }
      },
      (error) => {
        console.log("Need To Login First");
      }
    );

    this.idService.isManagerSub.subscribe((res) => {
      this.isManager = res;
    });
  }

  ngOnDestroy() {
    this.loginSub.unsubscribe();
    this.userDataSub.unsubscribe();
  }
}
