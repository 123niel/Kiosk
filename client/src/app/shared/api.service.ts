import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Article } from '../models/Article';
import { CartItem } from '../models/CartItem';
import { Customer } from '../models/Customer';
import { Transaction } from '../models/Transaction';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }

  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private apiUrl = 'http://localhost:9000/api';

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl + '/customer');
  }

  getCustomer(id): Observable<Customer> {
    return this.http.get<Customer>(this.apiUrl + '/customer/' + id);
  }

  addCustomer(firstname, lastname, details, credit): Observable<Customer> {
    return this.http.post<Customer>(
      this.apiUrl + '/customer',
      { firstname, lastname, details, credit },
      { headers: this.headers }
    );
  }

  addArticle(name, category, price): Observable<Article> {
    return this.http.post<Article>(
      this.apiUrl + '/article',
      { name, price, category },
      { headers: this.headers }
    );
  }

  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl + '/article');
  }

  postArticle(body): Observable<Article> {
    return this.http.post<Article>(this.apiUrl + '/article', body, {
      headers: this.headers,
    });
  }

  toggleArticle(id: string, disabled: boolean): Observable<Article> {

    const response = this.http.post<Article>(this.apiUrl + '/article/disable/', { id, disabled }, { headers: this.headers })
    return response
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl + '/action');
  }

  addTransaction(
    customerId: string,
    cart: CartItem[],
    deposit: number = 0
  ): Observable<Transaction> {
    return this.http.post<Transaction>(
      this.apiUrl + '/action',
      {
        customerId,
        cart,
        deposit,
        time: Date.now(),
      },
      { headers: this.headers }
    );
  }

  export() {
    return this.http.get(this.apiUrl + '/excel/export')
  }

  import(): Observable<any> {
    return this.http.get(this.apiUrl + '/excel/import')
  }
}
