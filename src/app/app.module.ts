import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { IdentificationComponent } from './identification/identification.component';
import { LoginComponent } from './identification/login/login.component';
import { AboutComponent } from './identification/about/about.component';
import { GeneralInfoComponent } from './identification/general-info/general-info.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { IdDetailsComponent } from './sign-in/id-details/id-details.component';
import { PersonalDetailsComponent } from './sign-in/personal-details/personal-details.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CartComponent } from './home-page/cart/cart.component';
import { ProductsComponent } from './home-page/products/products.component';
import { OrderComponent } from './order/order.component';
import { ShippingDetailsComponent } from './order/shipping-details/shipping-details.component';
import { FinalCartComponent } from './order/final-cart/final-cart.component';
import { OrderCompleteComponent } from './order-complete/order-complete.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { AddProductsComponent } from './home-page/products/add-products/add-products.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    IdentificationComponent,
    LoginComponent,
    AboutComponent,
    GeneralInfoComponent,
    SignInComponent,
    IdDetailsComponent,
    PersonalDetailsComponent,
    HomePageComponent,
    CartComponent,
    ProductsComponent,
    OrderComponent,
    ShippingDetailsComponent,
    FinalCartComponent,
    OrderCompleteComponent,
    LoadingComponent,
    AddProductsComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
