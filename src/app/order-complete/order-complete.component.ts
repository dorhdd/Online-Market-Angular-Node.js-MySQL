import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { OrderCompleteService } from "./order-complete.service";
import { saveAs } from "file-saver";
import { HomePageService } from "../home-page/home-page.service";

@Component({
  selector: "app-order-complete",
  templateUrl: "./order-complete.component.html",
  styleUrls: ["./order-complete.component.css"],
})
export class OrderCompleteComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderCompleteService: OrderCompleteService,
    private homePageService: HomePageService
  ) {}

  ngOnInit(): void {
    this.onCreateReceipt();
    this.homePageService.deleteAllCartProduct();
    this.homePageService.deleteCart();
    setInterval(() => {
      this.onComplete();
    }, 20000);
  }

  onComplete() {
    this.router.navigate([""], { relativeTo: this.route });
  }

  onCreateReceipt() {
    this.orderCompleteService.createReceipt();
  }

  onDownloadReceipt() {
    this.orderCompleteService.downloadReceipt().subscribe(
      (data) => {
        saveAs(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
