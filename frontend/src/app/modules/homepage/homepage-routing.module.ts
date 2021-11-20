import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import {MainComponent, BlockDetailsComponent, FaucetComponent, MediaComponent, ProductsComponent} from './containers';
import { HeaderComponent } from '../../shared/components';
import { MainLayoutComponent } from '../../shared/layouts';

const routes: Routes = [{
  path: '',
  component: MainLayoutComponent,
  children: [{
    path: '',
    children: [
        {
            path: '', component: HeaderComponent, outlet: 'header'
        }, {
            path: '', component: MainComponent
        }
    ]
  }, {
    path: 'faucet',
    children: [
      {
        path: '', component: HeaderComponent, outlet: 'header'
      }, {
        path: '', component: FaucetComponent
      }
    ]
  }, {
    path: 'media',
    children: [
      {
        path: '', component: HeaderComponent, outlet: 'header'
      }, {
        path: '', component: MediaComponent
      }
    ]
  }, {
    path: 'products',
    children: [
      {
        path: '', component: HeaderComponent, outlet: 'header'
      }, {
        path: '', component: ProductsComponent
      }
    ]
  }, {
    path: 'block/:hash',
    children: [
        {
            path: '', component: HeaderComponent, outlet: 'header'
        }, {
            path: '', component: BlockDetailsComponent
        }
    ]
  }, ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomepageRoutingModule {}
