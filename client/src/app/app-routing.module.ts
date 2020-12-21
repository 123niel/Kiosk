import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleTableComponent } from './article/article-table/article-table.component';
import { CounterComponent } from './counter/counter.component';
import { CustomerTableComponent } from './customer/customer-table/customer-table.component';

const routes: Routes = [
  { path: 'customer', component: CustomerTableComponent },
  { path: 'article', component: ArticleTableComponent },
  { path: '', pathMatch: 'full', component: CounterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
