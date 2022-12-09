import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import {HomeComponent} from './components/home/home.component';
import {ProfileComponent} from './components/profile/profile.component';
import {LotteryComponent} from './components/lottery/lottery.component';
import {AuctionComponent} from './components/auction/auction.component';
import { CreateSaleComponent } from './components/create-sale/create-sale.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
      path: 'sale/lottery/:contract_addr',
      component: LotteryComponent
  },
  {
    path: 'sale/auction/:contract_addr',
    component: AuctionComponent
  },
  {
    path: 'sale/create',
    component: CreateSaleComponent
  }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
