import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

import { Customer } from '../../models/Customer';
import { CustomerDetailDialogComponent } from '../customer-detail-dialog/customer-detail-dialog.component';
import { DepositDialogComponent } from '../deposit-dialog/deposit-dialog.component';
import { NewCustomerDialogComponent } from '../new-customer-dialog/new-customer-dialog.component';
import { CustomerService } from 'src/app/shared/customer.service';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss'],
})
export class CustomerTableComponent {
  customers: Customer[];
  tableData: any[];
  displayedCols = ['firstname', 'lastname', 'credit', 'deposit', 'details'];

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService
  ) { }

  customers$ = this.customerService.customers$;

  data$ = this.customers$.pipe(
    map(customers => customers.map(customer => ({
      firstname: customer.firstname,
      lastname: customer.lastname,
      transactions: customer.transactions,
      credit: this.customerService.calculateCredit(customer),
      deposit: () => this.openDeposit(customer),
      details: () =>
        this.showDetails(
          customer.firstname,
          customer.lastname,
          customer.transactions
        ),
    })))
  );

  openDeposit(customer: Customer) {
    this.dialog
      .open(DepositDialogComponent, {
        data: customer,
      })
      .afterClosed()
      .subscribe(amount => {
        if (amount)
          this.customerService.addTransaction(customer.id, [], amount * 100)
      });
  }

  openNewDialog(): void {
    const dialogRef = this.dialog.open(NewCustomerDialogComponent);
    dialogRef.afterClosed().pipe(
      map(result =>
        (result as string).split(',').map(name => {
          const nameParts = name.trim().split(' ').map(e => e.trim());
          return { lastname: nameParts.pop(), firstname: nameParts.join(' ') };
        })
      ),
    ).subscribe(names => names
      .filter(({ lastname, firstname }) => lastname !== '' && firstname !== '')
      .forEach(({ lastname, firstname }) =>
        this.customerService.addCustomer(firstname, lastname)
      )
    );
  }

  showDetails(firstname, lastname, transactions) {
    this.dialog.open(CustomerDetailDialogComponent, {
      data: { firstname, lastname, transactions },
    });
  }
}
