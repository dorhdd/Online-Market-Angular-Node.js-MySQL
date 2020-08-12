import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HomePageService implements OnInit {
  headers = new HttpHeaders().set(
    "Content-Type",
    "application/json; charset=utf-8"
  );
  haveCart: boolean;
  public cartProductsAdded = new Subject<any>();
  public cartId = new Subject<number>();

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  getProductsByCategoryId(categoryId) {
    return this.http.get(`homePage/product/${categoryId}`);
  }

  getAllProducts() {
    return this.http.get("homePage/products");
  }

  addProduct(obj) {
    return this.http.post("homePage/addProducts", obj);
  }

  addProductImg(fd) {
    return this.http.put("homePage/addProductImg", fd);
  }

  dataForEdit(skuValue: number) {
    return this.http
      .get(`homePage/dataForEdit/${skuValue}`)
      .pipe(map((response: any) => response));
  }

  editProduct(editData) {
    return this.http.put("homePage/editProduct", editData);
  }

  createCart() {
    return this.http.post("homePage/cart", {}).subscribe((res) => {
      this.cartCheck().subscribe();
    });
  }

  getCartProducts() {
    return this.http.get("homePage/cartProducts");
  }

  addCartProduct(cartProduct) {
    return this.http.post("homePage/addCartProducts", cartProduct);
  }

  deleteCartProduct(productId: number) {
    return this.http.delete(`homePage/deleteCartProducts/${productId}`);
  }

  deleteAllCartProduct() {
    return this.http
      .delete("homePage/deleteAllCartProducts")
      .subscribe((res) => {
        if (res["productsDeleted"]) {
          this.getCartProducts().subscribe((data) => {
            this.cartProductsAdded.next(data);
          });
        }
      });
  }

  deleteCart() {
    return this.http.delete("homePage/deleteCart").subscribe((error) => {
      console.log(error);
    });
  }

  cartCheck() {
    return this.http.get("start/cartCheck");
  }
}
