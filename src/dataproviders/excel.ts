import xlsx from 'node-xlsx';
import { promises as fs } from 'fs';
import { DatabaseAdapter } from './database-adapter';
import { Article } from '../models/article';

export class ExcelAdapter {
    private dbAdapter: DatabaseAdapter;

    constructor(db: DatabaseAdapter) {
        this.dbAdapter = db;
    }

    async save() {

        const customers = [
            ['First Name', 'Last Name', 'Group', 'Details', 'Credit (ct.)'],
            ...(this.dbAdapter.getCustomers()).map(customer => ([
                customer.firstname,
                customer.lastname,
                customer.group,
                customer.details,
                customer.transactions.reduce((sum, transaction) => sum
                    + transaction.deposit
                    - transaction.cart.reduce((cartSum, item) => cartSum
                        + (item.article.price * item.quantity)
                        , 0)
                    , 0),
            ]))
        ];

        const articles = [
            ['Name', 'Price', 'Category (ct.)', 'Disabled'],
            ...(this.dbAdapter.getArticles()).map(article => ([
                article.name,
                article.price,
                article.category,
                article.disabled
            ]))
        ];

        const buffer = xlsx.build([{ name: 'Customers', data: customers }, { name: 'Articles', data: articles }]);
        await fs.writeFile('kiosk.xlsx', Buffer.from(buffer));
        return { success: true };
    }

    async load(): Promise<any> {

        const data = xlsx.parse(await fs.readFile('kiosk.xlsx'));

        this.dbAdapter.reset();

        // firstname lastname group details credit
        const customers = data.find(sheet => sheet.name === 'Customers')?.data.slice(1).filter(row => row.length === 5).map(row => {

            const [firstname, lastname, group, details, credit] = row;

            if (typeof firstname !== 'string' || (firstname as string).length < 1) throw new Error(firstname + ' is not a valid first name');

            if (typeof lastname !== 'string' || (lastname as string).length < 1) throw new Error(lastname + ' is not a valid last name');


            return { firstname, lastname, group: group as string, details: details as string, credit: parseInt(credit as string, 10) || 0 };
        });

        if (customers) {
            customers.forEach(({ firstname, lastname, group, details, credit }) => {
                const { id } = this.dbAdapter.addCustomer({ firstname, lastname, id: 0, transactions: [], details, group });
                if (credit !== 0) {
                    this.dbAdapter.addTransaction(id, [], credit as number, new Date());
                }
            });
        }


        const articles = data.find(sheet => sheet.name === 'Articles')?.data.slice(1).filter(row => row.length === 4).map(row => {
            const [name, price, category, disabled] = row;
            if (typeof name !== 'string' || !name) throw new Error(name + ' is not a valid article name');
            if (typeof price !== 'number') throw new Error(price + ' is not a valid price');
            if (typeof category !== 'string') throw new Error(category + ' is not a valid category');
            if (typeof disabled !== 'boolean') throw new Error(disabled + ' is not a valid boolean value');
            return { name, price, category, disabled };
        });

        if (articles) {
            articles.forEach(({ name, price, category, disabled }) => {
                this.dbAdapter.addArticle({ name, price, category, disabled } as Article);
            });
        }

        return { imported: { customers: customers?.length, articles: articles?.length } };
    }
}
