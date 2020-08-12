import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SignInService } from "../sign-in.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-personal-details",
  templateUrl: "./personal-details.component.html",
  styleUrls: ["./personal-details.component.css"],
})
export class PersonalDetailsComponent implements OnInit {
  cities: any;
  signInForm: FormGroup;

  id: number;
  email: string;
  password: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signInService: SignInService
  ) {}

  ngOnInit(): void {
    this.signInService.getCities().subscribe(
      (data) => {
        this.cities = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.signForm();
  }

  private signForm() {
    let userCity = null;
    let userStreet = null;
    let userName = null;
    let userLastName = null;

    this.signInForm = new FormGroup({
      city: new FormControl(userCity, Validators.required),
      street: new FormControl(userStreet, Validators.required),
      name: new FormControl(userName, Validators.required),
      lastName: new FormControl(userLastName, Validators.required),
    });
  }

  onSubmit() {
    const fd = this.signInForm.value;
    var idDetails = this.signInService.idDetails;
    const city = this.cities.map((city) => city.city_name).indexOf(fd.city);

    var obj = {
      city: this.cities[city].cityId,
      street: fd.street.charAt(0).toUpperCase() + fd.street.slice(1),
      name: fd.name.charAt(0).toUpperCase() + fd.name.slice(1),
      lastName: fd.lastName,
      id: idDetails["id"],
      email: idDetails["email"],
      password: idDetails["password"],
    };

    this.signInService.personalData(obj).subscribe(
      (resData) => {
        if (resData["signInOk"] === true) {
          this.router.navigate([""], { relativeTo: this.route });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
