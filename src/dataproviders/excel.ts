import xlsx from 'node-xlsx';
import { promises as fs } from 'fs';
import { DatabaseAdapter } from './database-adapter';
import { Article } from '../models/article';
import { shell } from 'electron';


export class ExcelAdapter {
    private dbAdapter: DatabaseAdapter;

    constructor(db: DatabaseAdapter) {
        this.dbAdapter = db;
    }

    async save() {

        const customers = [
            ['First Name', 'Last Name', 'Credit'],
            ...(this.dbAdapter.getCustomers()).map(customer => ([
                customer.firstname,
                customer.lastname,
                customer.transactions.reduce((sum, transaction) => sum
                    + transaction.deposit
                    - transaction.cart.reduce((cartSum, item) => cartSum
                        + (item.article.price * item.quantity)
                        , 0)
                    , 0)
            ]))
        ];

        const articles = [
            ['Name', 'Price', 'Category', 'Disabled'],
            ...(this.dbAdapter.getArticles()).map(article => ([
                article.name,
                article.price,
                article.category,
                article.disabled
            ]))
        ];

        const buffer = xlsx.build([{ name: 'Customers', data: customers }, { name: 'Articles', data: articles }]);
        await fs.writeFile('kiosk.xlsx', Buffer.from(buffer));
    }

    async load(): Promise<any> {

        const data = xlsx.parse(await fs.readFile('kiosk.xlsx'));

        this.dbAdapter.reset();

        const customers = data.find(sheet => sheet.name === 'Customers')?.data.slice(1).filter(row => row.length > 1 && row.length < 4).map(row => {
            if (typeof row[0] !== 'string') throw new Error(row[0] + ' is not a valid first name');
            if (typeof row[1] !== 'string') throw new Error(row[1] + ' is not a valid last name');
            if (row.length < 3 || !row[2]) {
                return { firstname: row[0] as string, lastname: row[1] as string, credit: 0 };
            }
            return { firstname: row[0] as string, lastname: row[1] as string, credit: row[2] as number };
        });

        if (customers) {
            customers.forEach(({ firstname, lastname, credit }) => {
                const { id } = this.dbAdapter.addCustomer({ firstname, lastname, id: 0, transactions: [] });
                if (credit !== 0) {
                    this.dbAdapter.addTransaction(id, [], credit, new Date());
                }
            });
        }


        const articles = data.find(sheet => sheet.name === 'Articles')?.data.slice(1).filter(row => row.length === 4).map(row => {
            if (typeof row[0] !== 'string') throw new Error(row[0] + ' is not a valid article name');
            if (typeof row[1] !== 'number') throw new Error(row[0] + ' is not a valid price');
            if (typeof row[2] !== 'string') throw new Error(row[0] + ' is not a valid category');
            if (typeof row[3] !== 'boolean') throw new Error(row[0] + ' is not a valid boolean value');
            return { name: row[0], price: row[1], category: row[2], disabled: row[3] };
        });

        if (articles) {
            articles.forEach(({ name, price, category, disabled }) => {
                this.dbAdapter.addArticle({ name, price, category, disabled } as Article);
            });
        }

        return { imported: { customers: customers?.length, articles: articles?.length } }
    }
}
