import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LotteryComponent } from './components/lottery/lottery.component';
import { AuctionComponent } from './components/auction/auction.component';
import { CreateSaleComponent } from './components/create-sale/create-sale.component';
import { WalletInjectorService } from './services/wallet-injector.service';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    LotteryComponent,
    AuctionComponent,
    CreateSaleComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule, //for our forms
    HttpClientModule //for http-client for uploading to IPFS (use axios if this doesn't work)
  ],
  providers: [], //WalletInjectorService
  bootstrap: [AppComponent]
})
export class AppModule { }
