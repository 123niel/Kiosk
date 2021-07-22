import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Article } from 'src/app/models/Article';
import { NewArticleDialogComponent } from '../new-article-dialog/new-article-dialog.component';

@Component({
  selector: 'app-edit-article-dialog',
  templateUrl: './edit-article-dialog.component.html',
  styleUrls: ['./edit-article-dialog.component.scss']
})
export class EditArticleDialogComponent implements OnInit {

  // data: Article = {
  //   name: '',
  //   category: '',
  //   price: 0,
  //   id: '0',
  //   disabled: false
  // };

  constructor(public dialogRef: MatDialogRef<NewArticleDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Article) {
    console.log(this);
  }
  close() {
    this.dialogRef.close();
  }
  ngOnInit() { }

}
