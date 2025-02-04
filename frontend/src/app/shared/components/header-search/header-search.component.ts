import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { DataService } from './../../../services';
import { Router } from '@angular/router';
import { routesConsts } from './../../../consts';
import { ActivatedRoute} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss']
})
export class HeaderSearchComponent implements OnInit, AfterViewInit {
  @Input() isAssetsVal: boolean;

  public placeholderVal: string;
  @ViewChild('searchInput', { static: false }) input: ElementRef;
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private deviceService: DeviceDetectorService
    ) {}

  ngOnInit(): void {
    this.placeholderVal = 'Search here any transactions if they are not anonymous';
    // this.placeholderVal =  this.isAssetsVal ? 'Search by asset, description, ratio' : 'Search by height, hash, kernel ID';
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      if (params.searched_by !== undefined) {
        this.input.nativeElement.value = params.searched_by;
      }
    });
  }

  onEventMethod(e): void {
    e.placeholder = this.placeholderVal;
  }

  searchProcess(input): void {
    const searchValue = input.value.toLowerCase();
    input.value = '';

    if (!this.isAssetsVal) {
      this.dataService.searchBlock(searchValue).subscribe((blockItem) => {
        if (blockItem.hash !== undefined){
          this.router.navigate([routesConsts.BLOCK_DETAILS, blockItem.hash], {queryParams: {searched_by: searchValue}});
        }
      });
    } else {
      this.dataService.getAssetsList().subscribe((data) => {
        this.dataService.loadAssets(data);
      });

      const assetNameSearch = this.dataService.assetsList.find((item) => {
        return item.asset_name.toLowerCase().includes(searchValue);
      });

      if (assetNameSearch === undefined) {
        const descriptionSearch = this.dataService.assetsList.find((item) => {
          return item.full_desc.toLowerCase().includes(searchValue);
        });

        if (descriptionSearch === undefined) {
          const ratioSearch = this.dataService.assetsList.find((item) => {
            return item.ratio.toLowerCase().includes(searchValue);
          });

          if (ratioSearch !== undefined) {
            this.router.navigate([routesConsts.CONFIDENTIAL_ASSET_DETAILS, ratioSearch.id]);
          }
        } else {
          this.router.navigate([routesConsts.CONFIDENTIAL_ASSET_DETAILS, descriptionSearch.id]);
        }
      } else {
        this.router.navigate([routesConsts.CONFIDENTIAL_ASSET_DETAILS, assetNameSearch.id]);
      }
    }
  }
}
