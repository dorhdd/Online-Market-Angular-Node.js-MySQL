import { Component, OnInit } from "@angular/core";
import { HomePageService } from "../home-page.service";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  products: any;
  productsCopy: any;
  productSearch: string;
  myProducts = [];
  amount = [];

  constructor(private homePageService: HomePageService) {}

  ngOnInit(): void {
    this.onGetAllProducts();
  }

  onGetProductsByCategoryId(categoryId) {
    this.homePageService.getProductsByCategoryId(categoryId).subscribe(
      (data) => {
        this.products = data;
        this.productsCopy = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onGetAllProducts() {
    this.homePageService.getAllProducts().subscribe(
      (data) => {
        this.products = data;
        this.productsCopy = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSearch() {
    if (this.productSearch == "") {
      this.products = this.productsCopy;
    } else {
      this.products = this.productsCopy.filter((product) => {
        return product.product_name.includes(
          this.productSearch.charAt(0).toUpperCase() +
            this.productSearch.slice(1)
        );
      });
    }
  }

  onAddToCart(index) {
    if (this.amount[index] == undefined) {
      this.amount[index] = 1;
      this.products[index].amount = this.amount[index];
    } else {
      this.products[index].amount = this.amount[index];
    }
    this.products[index].totalPrice =
      this.products[index].price * this.products[index].amount;
    this.homePageService
      .addCartProduct(this.products[index])
      .subscribe((data) => {
        if (data["productAdded"]) {
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
}
