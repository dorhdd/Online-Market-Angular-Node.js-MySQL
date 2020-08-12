import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class OrderCompleteService {
  constructor(private http: HttpClient) {}

  createReceipt() {
    return this.http.get("receipt/createReceipt").subscribe((error) => {
      console.log(error);
    });
  }

  downloadReceipt() {
    return this.http.get("receipt/downloadReceipt", {
      responseType: "blob",
      headers: new HttpHeaders().append("content-type", "application/json"),
    });
  }
}
