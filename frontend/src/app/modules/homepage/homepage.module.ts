import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RECAPTCHA_V3_SITE_KEY, RecaptchaSettings, RecaptchaV3Module} from 'ng-recaptcha';

import { SharedModule } from '../../shared/shared.module';
import { HomepageRoutingModule } from './homepage-routing.module';
import { MainComponent, BlockDetailsComponent, FaucetComponent, MediaComponent } from './containers';
import { GraphsComponent, StatusCardsComponent, TableComponent, PoweredByComponent} from './components';

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import {NgApexchartsModule} from 'ng-apexcharts';
import {ReactiveFormsModule} from '@angular/forms';
import {environment} from '../../../environments/environment';

@NgModule({
  declarations: [
    MainComponent,
    BlockDetailsComponent,
    FaucetComponent,
    MediaComponent,
    StatusCardsComponent,
    GraphsComponent,
    TableComponent,
    PoweredByComponent,
  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: () => [ more, exporting ] },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.reCAPTCHA, },
  ],
    imports: [
        SharedModule,
        CommonModule,
        HomepageRoutingModule,
        ChartModule,
        MatPaginatorModule,
        MatExpansionModule,
        MatCardModule,
        MatTableModule,
        NgApexchartsModule,
        ReactiveFormsModule,
        RecaptchaV3Module
    ]
})
export class HomepageModule { }
