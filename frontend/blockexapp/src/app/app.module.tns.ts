import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module.tns';
import { AppComponent } from './app.component';
import { BlockListComponentTns } from './block-list/block-list.component.tns';
import { BlockDetailsComponentTns } from './block-details/block-details.component.tns';


import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { GridViewModule } from "nativescript-grid-view/angular";
// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';

@NgModule({
  declarations: [
    AppComponent,
    BlockListComponentTns,
    BlockDetailsComponentTns,
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    HttpClientModule,
    NativeScriptUIListViewModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    GridViewModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
