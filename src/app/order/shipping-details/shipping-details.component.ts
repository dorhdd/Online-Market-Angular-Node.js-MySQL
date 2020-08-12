import { Component, OnInit, resolveForwardRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { OrderService } from "../order.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-shipping-details",
  templateUrl: "./shipping-details.component.html",
  styleUrls: ["./shipping-details.component.css"],
})
export class ShippingDetailsComponent implements OnInit {
  cities: any;
  orderForm: FormGroup;
  totalPrice: number;
  userDetails;
  dateCheck: any;
  dateArr = [];
  shippingError = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderService.totalPriceSub.subscribe((res) => {
      this.totalPrice = res;
    });
    this.onGetCities();
    this.orderFormFunc();
    this.onShippingData();
  }

  onGetCities() {
    this.orderService.getCities().subscribe(
      (res) => {
        this.cities = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private orderFormFunc() {
    var city = null;
    var street = null;
    var shippingDate = null;
    var cardNumber = null;

    this.orderForm = new FormGroup({
      city: new FormControl(city, Validators.required),
      street: new FormControl(street, Validators.required),
      shippingDate: new FormControl(shippingDate, [
        Validators.required,
        this.onDateCheck.bind(this),
      ]),
      cardNumber: new FormControl(cardNumber, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
    });
  }

  onSubmit() {
    var value = this.orderForm.value;
    const details = {
      city: value.city,
      street: value.street.charAt(0).toUpperCase() + value.street.slice(1),
      totalPrice: this.totalPrice,
      shippingDate: value.shippingDate,
      orderDate: new Date(),
      cardNumber: String(value.cardNumber).substr(-4, 4),
    };

    this.orderService.saveOrderDetails(details).subscribe(
      (res) => {
        if (res["orderSaved"]) {
          this.router.navigate(["/complete"], { relativeTo: this.route });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onDateCheck() {
    var duplicate = [];
    this.dateArr.map((el) => {
      if (this.orderForm.get("shippingDate").value === el) {
        duplicate.push(el);
      }
    });
    if (duplicate.length > 3) {
      return { shippingError: true };
    }
    return null;
  }

  onShippingData() {
    this.orderService.dateCheck().subscribe(
      (data) => {
        this.dateCheck = data;
        this.dateCheck.map((date) => {
          this.dateArr.push(date.shipping_date.substring(0, 10));
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onDblclick() {
    this.orderService.getCustomerDetails().subscribe(
      (res) => {
        this.userDetails = res;
        this.userDetails.map((field) => {
          const city = this.cities.find((city) => city.cityId == field.city);
          this.orderForm.get("city").setValue(city.city_name);
          this.orderForm.get("street").setValue(field.street);
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
