import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  totalPriceSub = new Subject<number>();

  constructor(private http: HttpClient) {}

  getCartProducts() {
    return this.http.get("order/cartProducts");
  }

  getCities() {
    return this.http.get("order/cities");
  }

  saveOrderDetails(details) {
    return this.http.post("order/orderDetails", details);
  }

  getCustomerDetails() {
    return this.http.get("order/customerDetails");
  }

  dateCheck(){
    return this.http.get("order/dateCheck")
  }

}
