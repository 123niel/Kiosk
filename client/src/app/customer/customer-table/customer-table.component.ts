import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';

import { Customer } from '../../models/Customer';
import { CustomerDetailDialogComponent } from '../customer-detail-dialog/customer-detail-dialog.component';
import { DepositDialogComponent } from '../deposit-dialog/deposit-dialog.component';
import { NewCustomerDialogComponent } from '../new-customer-dialog/new-customer-dialog.component';
import { CustomerService } from 'src/app/shared/customer.service';
import { Transaction } from 'src/app/models/Transaction';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';

interface TableDataModel {
  firstname: string;
  lastname: string;
  group: string;
  transactions: Transaction[];
  credit: number;
  deposit: () => void;
  details: () => void;
}

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss'],
})
export class CustomerTableComponent implements OnInit {
  displayedCols = ['firstname', 'lastname', 'group', 'credit', 'deposit', 'details'];
  tableData: MatTableDataSource<TableDataModel> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  filter = new FormControl('');

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.customerService.customers$.pipe(
      map(customers => customers.map(customer => ({
        firstname: customer.firstname,
        lastname: customer.lastname,
        group: customer.group,
        transactions: customer.transactions,
        credit: this.customerService.calculateCredit(customer),
        deposit: () => this.openDeposit(customer),
        details: () =>
          this.showDetails(
            customer.firstname,
            customer.lastname,
            customer.transactions,
            customer.details,
            customer.group
          ),
      })))
    ).subscribe(data => {
      this.tableData.data = data;
      this.tableData.paginator = this.paginator;
      this.tableData.sort = this.sort;
    });

    this.filter.valueChanges.subscribe(value => this.tableData.filter = value.trim().toLowerCase())
  }

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
    this.dialog.open(NewCustomerDialogComponent)
      .afterClosed()
      .subscribe(({ firstname, lastname, group, details, credit }) => {
        const cents = parseFloat((credit as string).replace(",", ".")) * 100
        this.customerService.addCustomer(firstname, lastname, group, details, cents || 0)
      }
      )

  }

  showDetails(firstname, lastname, transactions, details, group) {
    this.dialog.open(CustomerDetailDialogComponent, {
      data: { firstname, lastname, transactions, details, group },
    });
  }
}
