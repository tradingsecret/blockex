import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {DataService} from '../../../../services';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  activeCurrency: string;
  public isMobile = this.deviceService.isMobile();
  constructor(
    private deviceService: DeviceDetectorService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const kernel_id = this.route.snapshot.queryParamMap.get('kernel_id');
    if (kernel_id) {
      this.dataService.searchBlock(kernel_id).subscribe((blockItem) => {
        this.router.navigate(['/block/' + blockItem.hash], { queryParams: {searched_by: kernel_id}});
      });
    }
  }

  onChangeStatsCurrency(value: string) {
    this.activeCurrency = value;
  }
}
