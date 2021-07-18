import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewArticleDialogComponent } from '../new-article-dialog/new-article-dialog.component';
import { ArticleService } from 'src/app/shared/article.service';
import { map, startWith, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable, of, scheduled } from 'rxjs';

@Component({
  selector: 'app-article-table',
  templateUrl: './article-table.component.html',
  styleUrls: ['./article-table.component.scss'],
})
export class ArticleTableComponent implements OnInit {
  displayedCols = ['name', 'category', 'price', 'toggle'];
  data$: Observable<{
    index: number, name: string, category: string, id: string, price: number, disabled: boolean, toggle: () => void
  }[]>;

  constructor(
    private articleService: ArticleService, private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.data$ = this.articleService.articles$.pipe(
      map(articles => articles
        .map((article, index) => ({
          index,
          name: article.name,
          category: article.category,
          id: article.id,
          price: article.price,
          disabled: article.disabled,
          toggle: () => this.articleService.toggle(article)
        }))
      )
    );
  }

  openNewDialog() {
    this.dialog
      .open(NewArticleDialogComponent)
      .afterClosed()
      .subscribe(({ name, category, price }) => {
        const cents = parseFloat((price as string).replace(",", ".")) * 100
        this.articleService.addArticle(name, category, Math.floor(cents))
      }
      );
  }
}
