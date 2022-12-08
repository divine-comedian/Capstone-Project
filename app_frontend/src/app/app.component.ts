
import { Component } from '@angular/core';
import { SalesContractService } from "./services/sales-contract.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Test Routing';
  //someRootVar = 'SharedRootVar';
  constructor(
    private salesContractService: SalesContractService
  ) {}
}



