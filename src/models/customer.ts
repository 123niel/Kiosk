import { Transaction } from "./transaction";

export default interface Customer {
  id: number;
  firstname: string;
  lastname: string;
  transactions: Transaction[];
}
