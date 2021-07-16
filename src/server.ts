import path from 'path';
import fs from 'fs';

import { ExpressApp } from './api/ExpressApp';

const json = JSON.stringify({
  nextArticleID: 0,
  nextCustomerID: 0,
  nextTransactionID: 3,
  customers: [],
  articles: []
});


// fs.writeFile(path.join(__dirname, 'kiosk.json'), json, { flag: 'wx' }, (err => {
//   if (err) {
//     if (err.code === 'EEXIST') {
//       console.log('not creating db-file, alredy exists');
//     } else {
//       console.log(err);
//     }
//   }
// }));

const api = new ExpressApp();
api.start(9000);
