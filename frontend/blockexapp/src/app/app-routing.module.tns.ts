import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import {BlockListComponent} from "./block-list/block-list.component";

export const routes: Routes = [
  {
      path: '',
      redirectTo: '/block-list',
      pathMatch: 'full',
  },
  {
      path: 'block-list',
      component: BlockListComponent,
  },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
