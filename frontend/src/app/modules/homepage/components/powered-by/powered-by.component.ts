import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-powered-by',
  templateUrl: './powered-by.component.html',
  styleUrls: ['./powered-by.component.scss']
})
export class PoweredByComponent implements OnInit, OnDestroy {
  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
