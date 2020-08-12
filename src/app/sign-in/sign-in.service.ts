import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SignInService {
  idDetails:{};
  headers = new HttpHeaders().set(
    "Content-Type",
    "application/json; charset=utf-8"
  );

  constructor(private http: HttpClient) {}

  idCheck(id: number) {
    return this.http.post("start/idCheck", { id: id });
  }

  personalData(obj) {    
    return this.http.post("start/signInB", obj);
  }

  getCities() {
    return this.http.get("start/cities", { headers: this.headers });
  }
}
