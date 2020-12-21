import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { CartItemComponent } from './cart/cart-item/cart-item.component';
import { CartComponent } from './cart/cart.component';
import { CounterComponent } from './counter.component';
import { CustomerPickerComponent } from './customer-picker/customer-picker.component';
import { ShelfComponent } from './shelf/shelf.component';
import { KeyvaluesComponent } from './keyvalues/keyvalues.component';

@NgModule({
  declarations: [
    CounterComponent,
    CartComponent,
    CustomerPickerComponent,
    ShelfComponent,
    CartItemComponent,
    KeyvaluesComponent,
  ],
  imports: [CommonModule, SharedModule],
})
export class CounterModule { }
