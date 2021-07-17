import { Transaction } from './Transaction';

export interface Customer {
  id: string;
  lastname: string;
  firstname: string;
  details: string;
  transactions: Transaction[];
}
