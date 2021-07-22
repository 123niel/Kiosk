import { Transaction } from './transaction';

export interface Customer {
  id: number;
  firstname: string;
  lastname: string;
  details: string;
  group: string;
  transactions: Transaction[];
}
