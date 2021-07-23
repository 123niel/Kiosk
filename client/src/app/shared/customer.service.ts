import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/CartItem';
import { Customer } from '../models/Customer';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customersSubject = new BehaviorSubject<Customer[]>([])
  private selectedSubject = new BehaviorSubject<Customer>(null);
  customers$ = this.customersSubject.asObservable();
  selectedCustomer$ = this.selectedSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.fetchCustomers();
  }

  fetchCustomers() {
    this.apiService.getAllCustomers().subscribe(customers =>
      this.customersSubject.next(customers)
    );
  }

  addCustomer(firstname: string, lastname: string, group: string, details: string, credit: number) {
    this.apiService.addCustomer(firstname, lastname, group, details, credit)
      .subscribe(customer => {
        const customers = this.customersSubject.getValue();
        customers.push(customer);
        this.customersSubject.next(customers);
      })
  }

  addTransaction(customerId: string, cart: CartItem[], deposit: number) {
    this.apiService.addTransaction(customerId, cart, deposit)
      .subscribe(transaction => {
        const customers = this.customersSubject.getValue();
        const customer = customers.find(c => c.id === customerId);
        customer.transactions.push(transaction);
        this.customersSubject.next(customers);
      });
  }

  selectCustomer(customer: Customer) {
    this.selectedSubject.next(customer);
  }

  clearSelectedCustomer() {
    this.selectedSubject.next(null);
  }

  editCustomer(id: string, firstname: string, lastname: string, details: string, group: string) {
    this.apiService.updateCustomer(id, firstname, lastname, details, group)
      .subscribe(c => {
        const oldCustomers = this.customersSubject.getValue();
        const newCustomers = [...oldCustomers];

        newCustomers[c.id] = c;
        this.customersSubject.next(newCustomers);
      })
  }

  calculateCredit(customer: Customer) {
    return customer.transactions.reduce((sum, transaction) =>
      sum += transaction.deposit
      - transaction.cart.reduce((cartSum, cartItem) => cartSum + cartItem.article.price * cartItem.quantity, 0)
      , 0);
  }
}
