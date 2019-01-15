import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import {BlockListComponentTns} from "./block-list/block-list.component.tns";
import {BlockDetailsComponentTns} from "./block-details/block-details.component.tns";

export const routes: Routes = [
  { path: '', redirectTo: '/block-list', pathMatch: 'full',},
  { path: 'block-list', component: BlockListComponentTns,},
  { path: 'block/:hash', component: BlockDetailsComponentTns,},
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
