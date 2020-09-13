import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule, scrollPreset } from 'ng-lazyload-image';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(value: any, args?: any): any {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@NgModule({
  declarations: [SafeHtmlPipe],
  imports: [
    CommonModule,
    FormsModule, 
    RouterModule,
    LazyLoadImageModule.forRoot({
      preset: scrollPreset
    })
  ],
  exports: [ 
    SafeHtmlPipe,
    FormsModule,
    LazyLoadImageModule
  ],
})
export class CommonsModule { }
