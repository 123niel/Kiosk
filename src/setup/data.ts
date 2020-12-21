import path from 'path';
import fs from 'fs';

import { Article } from '../models/article';
import { Customer } from '../models/customer';
import { JsonDB } from 'node-json-db';

(async () => {

  const json = JSON.parse(
    await fs.readFileSync(path.join(__dirname, '/demoData.json'), 'utf8'),
  );

  const articles: Article[] = json.articles.map((article: Article, index: number) => ({
    ...article,
    id: index,
    disabled: false
  }));
  const nextArticleID = articles.length;

  const customers: Customer[] = json.customers.map((customer: Customer, index: number) => ({
    ...customer,
    id: index,
    transactions: []
  }));
  const nextCustomerID = customers.length;

  const nextTransactionID = 0;

  const data = {
    nextArticleID,
    nextCustomerID,
    nextTransactionID,
    articles,
    customers
  };

  const str = JSON.stringify(data);
  await fs.writeFileSync(path.join(process.cwd(), "kiosk.json"), str);

})().then(() => {
  console.log('done');
  process.exit(0);
})
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
