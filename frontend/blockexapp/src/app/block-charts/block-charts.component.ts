import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-block-charts',
  templateUrl: './block-charts.component.html',
  styleUrls: ['./block-charts.component.css']
})
export class BlockChartsComponent implements OnInit {
  loading_status: boolean = false;
  height: any;

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  backToExplorer() {
      this.router.navigate(
          ['/blocks']
      );
  }

  public onChartsLoaded(chartsStatus: boolean) {
    if (chartsStatus){
      this.loading_status = false;
    }
  }

  ngOnInit() {
      this.loading_status = true;
      this.route.params.subscribe( (params) => {
          if (params.height) {
            this.height = params.height;
          }
      });
  }

}
