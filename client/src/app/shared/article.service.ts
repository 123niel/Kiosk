import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Article } from '../models/Article';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private articlesSubject = new BehaviorSubject<Article[]>([]);
  articles$ = this.articlesSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.fetchArticles();
  }

  fetchArticles() {
    this.apiService.getAllArticles()
      .subscribe(articles => this.articlesSubject.next(articles));
  }

  addArticle(name: string, category: string, price: number) {
    this.apiService.addArticle(name, category, price).subscribe(article => {
      const articles = this.articlesSubject.getValue();
      articles.push(article);
      this.articlesSubject.next(articles);
    });
  }

  toggle(article: Article) {
    this.apiService.toggleArticle(article.id, !article.disabled)
      .subscribe(article => {
        const oldArticles = this.articlesSubject.getValue();

        const newArticles = oldArticles.filter(a => a.id !== article.id);
        newArticles.push(article);

        this.articlesSubject.next(newArticles);
      });
  }
}
