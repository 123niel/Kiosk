import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-keyvalues',
  templateUrl: './keyvalues.component.html',
  styleUrls: ['./keyvalues.component.scss'],
})
export class KeyvaluesComponent {
  @Input() sum: number;
  @Input() credit: number;
}
