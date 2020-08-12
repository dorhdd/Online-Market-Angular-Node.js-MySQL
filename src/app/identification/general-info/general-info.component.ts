import { Component, OnInit, OnDestroy } from "@angular/core";
import { IdService } from "../id.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-general-info",
  templateUrl: "./general-info.component.html",
  styleUrls: ["./general-info.component.css"],
})
export class GeneralInfoComponent implements OnInit {
  ordersAmount: number;
  availableProducts: number;
  isLoggeIn: boolean;
  constructor(private idService: IdService) {}

  ngOnInit(): void {
    this.onGeneralInfo();
  }

  onGeneralInfo() {
    this.idService.availableProducts().subscribe(
      (data) => {
        this.availableProducts = data["availableProducts"];
      },
      (error) => {
        console.log(error);
      }
    );

    this.idService.ordersAmount().subscribe(
      (data) => {
        this.ordersAmount = data["ordersAmount"];
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
