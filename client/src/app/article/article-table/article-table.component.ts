import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewArticleDialogComponent } from '../new-article-dialog/new-article-dialog.component';
import { ArticleService } from 'src/app/shared/article.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { EditArticleDialogComponent } from '../edit-article-dialog/edit-article-dialog.component';
import { Article } from 'src/app/models/Article';

interface TableDataModel {
  index: number;
  name: string;
  category: string;
  id: string;
  price: number;
  disabled: boolean;
  toggle: () => void;
  edit: () => void;
}


@Component({
  selector: 'app-article-table',
  templateUrl: './article-table.component.html',
  styleUrls: ['./article-table.component.scss'],
})
export class ArticleTableComponent implements OnInit {
  displayedCols = ['name', 'category', 'price', 'toggle', 'edit'];
  tableData: MatTableDataSource<TableDataModel> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  filter = new FormControl('');

  constructor(
    private articleService: ArticleService, private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.articleService.articles$.pipe(
      map(articles => articles
        .map((article, index) => ({
          index,
          name: article.name,
          category: article.category,
          id: article.id,
          price: article.price,
          disabled: article.disabled,
          toggle: () => this.articleService.toggle(article),
          edit: () => this.openEditDialog(article)
        }))
      )
    ).subscribe(data => {
      this.tableData.data = data;
      this.tableData.paginator = this.paginator;
      this.tableData.sort = this.sort;
    });

    this.filter.valueChanges.subscribe(value => this.tableData.filter = value.trim().toLowerCase())
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

  openEditDialog(article: Article) {
    this.dialog
      .open(EditArticleDialogComponent, {
        data: article
      })
      .afterClosed()
      .subscribe(({ id, name, category }) => {
        this.articleService.editArticle(id, name, category)
      })
  }
}
