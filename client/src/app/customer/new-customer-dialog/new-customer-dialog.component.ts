import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-customer-dialog',
  styleUrls: ['new-customer-dialog.component.scss'],
  templateUrl: './new-customer-dialog.component.html',
})
export class NewCustomerDialogComponent implements OnInit {
  names: string;

  constructor(public dialogRef: MatDialogRef<NewCustomerDialogComponent>) {}

  close() {
    this.dialogRef.close();
  }

  ngOnInit() {}
}
