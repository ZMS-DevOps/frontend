import {CommonModule, DatePipe} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedRoutes} from './shared.routes';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateFormatPipe} from './pipes/date-format.pipe';
import {CustomMaterialModuleModule} from "../../custom-material-module/custom-material-module.module";
import {NgxStarsModule} from "ngx-stars";
import {CarouselModule} from 'primeng/carousel';

@NgModule({
  declarations: [
    DateFormatPipe,
  ],
  exports: [
    DateFormatPipe,
  ],
  providers: [
    DatePipe,
  ],
  imports: [
    CommonModule,
    CustomMaterialModuleModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(SharedRoutes),
    ReactiveFormsModule,
    NgxStarsModule,
    CarouselModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedModule {}
