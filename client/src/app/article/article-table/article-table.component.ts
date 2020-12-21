import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewArticleDialogComponent } from '../new-article-dialog/new-article-dialog.component';
import { ArticleService } from 'src/app/shared/article.service';
import { map, startWith, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { of, scheduled } from 'rxjs';

@Component({
  selector: 'app-article-table',
  templateUrl: './article-table.component.html',
  styleUrls: ['./article-table.component.scss'],
})
export class ArticleTableComponent implements OnInit {
  displayedCols = ['name', 'category', 'price', 'toggle'];

  showDisabled: boolean;

  filterControl = new FormControl();

  articles$ = this.articleService.articles$;

  data$;

  ngOnInit() {

    this.articles$.subscribe(articles =>

      this.data$ = this.filterControl.valueChanges.pipe(
        startWith(this.showDisabled),
        map(showDisabled =>
          articles.filter(article => showDisabled || !article.disabled)
            .map((article) => ({
              name: article.name,
              category: article.category,
              id: article.id,
              price: article.price,
              disabled: article.disabled,
              toggle: () => this.articleService.toggle(article)
            }))
        ))
    );

  }

  constructor(
    private articleService: ArticleService, private dialog: MatDialog
  ) { }

  openNewDialog() {
    this.dialog
      .open(NewArticleDialogComponent)
      .afterClosed()
      .subscribe(({ name, category, price }) =>
        this.articleService.addArticle(name, category, price)
      );
  }
}
