import { Component, OnInit } from '@angular/core';

import { SalesMongoService} from '../../services/sales-mongo-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public sales: any[] = [];

  constructor(private salesMongoService: SalesMongoService) { }

  ngOnInit(): void {
    
    const sales = this.salesMongoService.getSalesFromMongoDB(); //add await here later as it'll prob become a promise
    this.sales = sales;
  }

}
