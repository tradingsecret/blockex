import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './layouts';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components';
import { HeaderLogoComponent } from './components/header-logo/header-logo.component';
import { HeaderToggleSwitchComponent } from './components/header-toggle-switch/header-toggle-switch.component';
import { HeaderSearchComponent } from './components/header-search/header-search.component';
import {TopChartComponent} from './components/top-chart/top-chart.component';
import {NgApexchartsModule} from 'ng-apexcharts';

@NgModule({
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    HeaderLogoComponent,
    HeaderToggleSwitchComponent,
    HeaderSearchComponent,
    TopChartComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgApexchartsModule,
  ],
  exports: [
    MainLayoutComponent,
    HeaderComponent
  ],
  providers: [
  ]
})
export class SharedModule { }
