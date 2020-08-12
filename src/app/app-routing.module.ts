import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IdentificationComponent } from "./identification/identification.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { OrderCompleteComponent } from "./order-complete/order-complete.component";
import { OrderComponent } from "./order/order.component";
import { IdDetailsComponent } from "./sign-in/id-details/id-details.component";
import { PersonalDetailsComponent } from "./sign-in/personal-details/personal-details.component";
import { AuthGuard } from './identification/login/auth.guard';
import { AddProductsComponent } from './home-page/products/add-products/add-products.component';
import { AddGuard } from './home-page/products/add-products/add.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: "", component: IdentificationComponent, pathMatch: "full" },
  {
    path: "signin",
    component: SignInComponent,
    children: [
      { path: "", component: IdDetailsComponent, pathMatch: "full" },
      { path: "personal", component: PersonalDetailsComponent },
    ],
  },
  { path: "home", component: HomePageComponent, canActivate: [AuthGuard]},
  { path: "order", component: OrderComponent, canActivate: [AuthGuard] },
  { path: "complete", component: OrderCompleteComponent, canActivate: [AuthGuard] },
  { path: "addProduct", component: AddProductsComponent, canActivate: [AddGuard ,AuthGuard] },
  { path: "*", component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
