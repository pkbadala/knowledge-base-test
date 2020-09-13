import { Component } from '@angular/core';
import { BaseComponent } from './common/commonComponent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent {
  title = 'angular-project';
}
