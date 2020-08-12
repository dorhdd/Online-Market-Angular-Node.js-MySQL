import { Component, OnInit } from "@angular/core";
import { OrderService } from "../order.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-final-cart",
  templateUrl: "./final-cart.component.html",
  styleUrls: ["./final-cart.component.css"],
})
export class FinalCartComponent implements OnInit {
  myClass = false;
  cartProducts;
  cartProductsCopy;
  productSearch: string;
  totalPrice: number = 0;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.onGetCartProducts();
  }

  onGetCartProducts() {
    this.orderService.getCartProducts().subscribe(
      (res) => {
        this.cartProducts = res;
        this.cartProductsCopy = res;
        this.cartProducts.map((totalPrice) => {
          this.totalPrice += totalPrice.total_price;
        });
        this.orderService.totalPriceSub.next(this.totalPrice);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onBackShopping() {
    this.router.navigate(["/home"], { relativeTo: this.route });
  }

  onSearch() {
    if (this.productSearch == "") {
      this.myClass = false;
      this.cartProducts = this.cartProductsCopy;
    } else {
      this.myClass = true;
      this.cartProducts = this.cartProductsCopy.filter((product) => {
        return product.product_name.includes(
          this.productSearch.charAt(0).toUpperCase() +
            this.productSearch.slice(1)
        );
      });
    }
  }
}
