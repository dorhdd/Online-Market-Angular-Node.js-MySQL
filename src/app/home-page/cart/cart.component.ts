import { Component, OnInit, OnDestroy } from "@angular/core";
import { HomePageService } from "../home-page.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit, OnDestroy {
  prosuctsData: Subscription;
  cartProducts = [];
  allProductsPrice = 0;
  amount = 0;
  clearButton = false;

  constructor(private homePageService: HomePageService) {}

  ngOnInit(): void {
    this.prosuctsData = this.homePageService.cartProductsAdded.subscribe(
      (data) => {
        this.allProductsPrice = 0;
        this.cartProducts = data;

        this.cartProducts.map((field) => {
          this.amount = field.amount;
          this.allProductsPrice += field.total_price;
        });
        if (this.cartProducts.length >= 1) {
          this.clearButton = true;
        } else {
          this.clearButton = false;
        }
      }
    );
    this.productsLoadding();
  }

  onDeleteItem(index) {
    this.allProductsPrice -= this.cartProducts[index].total_price;
    const productId = this.cartProducts[index].product_id;
    this.homePageService.deleteCartProduct(productId).subscribe((data) => {
      if (data["productDeleted"]) {
        this.homePageService.getCartProducts().subscribe(
          (data) => {
            this.homePageService.cartProductsAdded.next(data);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }

  productsLoadding() {
    this.homePageService.cartCheck().subscribe(
      (res) => {
        if (res["haveCart"]) {
          this.homePageService.getCartProducts().subscribe((data) => {
            this.homePageService.cartProductsAdded.next(data);
          });
        }
        if (res["haveCart"] === false) {
          this.homePageService.createCart();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onClearCart() {
    this.homePageService.deleteAllCartProduct();
  }

  ngOnDestroy() {
    this.prosuctsData.unsubscribe();
  }
}
