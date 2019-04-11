import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../services';
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { ChartsComponent } from '../charts-component/charts-component.component';
import { ListViewLinearLayout, RadListView, LoadOnDemandListViewEventData } from "nativescript-ui-listview";
import {PageEvent} from '@angular/material';
import { Router} from '@angular/router';

import { SegmentedBar, SegmentedBarItem } from "tns-core-modules/ui/segmented-bar";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { Page } from "tns-core-modules/ui/page";
import {chartsConsts} from "../consts";


@Component({
  selector: 'app-block-list-tns',
  templateUrl: './block-list.component.tns.html',
  styleUrls: ['./block-list.component.tns.css']
})
export class BlockListComponentTns implements OnInit {
  private _dataItems: ObservableArray<any>;
  private layout: ListViewLinearLayout;
  public selectedIndex = 0;
  public segBarItems: Array<SegmentedBarItem>;

  chartsData: any = {
      range: [],
      rangeLabels: [],
      difficulty: [],
      fee: [],
      fixedLine: [],
      averageBlocks: [],
      min: {},
      max: {}
    };

  status : any; // basically latest block and some data
  blocks : any;
  count : number;
  page : number = 0;
  searchItem : string;

  loading_status : boolean = false;
  loading_blocks : boolean = false;
  loading_charts : boolean = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private pageTns: Page,
    private _changeDetectionRef: ChangeDetectorRef) {

    this.segBarItems = [];

    //TODO
    let segmentedBarItem = <SegmentedBarItem>new SegmentedBarItem();
    segmentedBarItem.title = "Overview";
    this.segBarItems.push(segmentedBarItem);
    segmentedBarItem = <SegmentedBarItem>new SegmentedBarItem();
    segmentedBarItem.title = "Blocks";
    this.segBarItems.push(segmentedBarItem);
    segmentedBarItem = <SegmentedBarItem>new SegmentedBarItem();
    segmentedBarItem.title = "Charts";
    this.segBarItems.push(segmentedBarItem);
  }

   onSelectedIndexChange(args) {
        let segmetedBar = <SegmentedBar>args.object;
        this.selectedIndex = segmetedBar.selectedIndex;
    }

  public loadBlocks(event?:PageEvent){

    this.loading_blocks = true;
    this.page = event ? event.pageIndex : 0;

    this.dataService.loadBlocks(this.page).subscribe((data) => {
      this.loading_blocks = false;

      this.blocks = data['results'];
      this.dataItems.push(data['results']);
      this.count = data['count'];
      this.page++;
     });

    return event;
  }

  public onSubmit(args) {
      let searchBar = <SearchBar>args.object;
      if (searchBar.text !== undefined && searchBar.text.length > 0) {
        this.loading_blocks = true;
        this.dataService.searchBlock(searchBar.text).subscribe((blockItem) => {
          this.loading_blocks = false;
          if (blockItem.found !== undefined && !blockItem.found) {
            this.router.navigate(
              ['/block-not-found']
            );
          } else if (blockItem.hash !== undefined){
            this.router.navigate(
              ['/block', blockItem.hash]
            );
          }
        }, (error) => {
            this.router.navigate(
                ['/block-not-found']
            );
        });
      }
  }

  public searchBarLoaded(args){
    let searchBar:SearchBar = <SearchBar>args.object;
    //if(isAndroid){
      searchBar.android.clearFocus();
    //}
  }

  public onTextChanged(args) {
      let searchBar = <SearchBar>args.object;
  }

  public showBlockDetails(hash) {
    this.router.navigate(
      ['/block', hash]
    );
  }

  constructChartsData(data) {
    let initialDate = new Date(data[0].timestamp);
    let avgDifficulty = 0;
    let chartsData = {
      range: [],
      rangeLabels: [],
      difficulty: [],
      fee: [],
      fixedLine: [],
      averageBlocks: [],
      min: {},
      max: {}
    };
    let blocksCounter = 0, feeCounter = 0;

    data.map((item, index, data) => {
      if (index == 0) {
          chartsData.min = new Date(item.timestamp);
        } else if (index == data.length - 1) {
          chartsData.max = new Date(item.timestamp);
        }


      let initialDateWithOffset = initialDate.getTime()
        + chartsConsts.MINUTE * chartsConsts.COUNT_OF_MINUTES;

      if (new Date(item.timestamp).getTime() <= initialDateWithOffset) {
        blocksCounter++;
        feeCounter += item.fee;
        avgDifficulty += item.difficulty;
      } else {
        chartsData.range.push({Blocks_per_hour: blocksCounter, Date: new Date(item.timestamp)});
        chartsData.difficulty.push({difficulty: avgDifficulty / blocksCounter, Date: new Date(item.timestamp)});
        chartsData.fee.push({fee: feeCounter, Date: new Date(item.timestamp)});
        feeCounter = item.fee;
        blocksCounter = 1;
        avgDifficulty = 0;
        initialDate = new Date(item.timestamp);
      }
    });

    let averageBlocks = data.length / chartsData.range.length;
    chartsData.averageBlocks.length = chartsData.range.length;
    chartsData.fixedLine.length = chartsData.range.length;
    chartsData.averageBlocks.fill(averageBlocks, 0, chartsData.range.length);
    chartsData.fixedLine.fill(chartsConsts.FIXED_BLOCKS_COORD, 0, chartsData.range.length);

    this.loading_charts = false;
    return chartsData;
  }

  ngOnInit() {
    this.pageTns.actionBarHidden = true;
    this.loading_status = true;
    this.loading_charts = true;

    this.layout = new ListViewLinearLayout();
      this.layout.scrollDirection = "Vertical";
      this._changeDetectionRef.detectChanges();
      this._dataItems = new ObservableArray<any>();


    this.dataService.loadStatus().subscribe((status) => {
      this.status = status;
      this.loading_status = false;
    });

    this.dataService.loadBlocksRange().subscribe((data) => {
      this.chartsData = this.constructChartsData(data);
    });

    this.loadBlocks(null);
  }

  public get dataItems(): ObservableArray<any> {
    return this._dataItems;
  }

  public onLoadMoreItemsRequested(args: LoadOnDemandListViewEventData) {
    const listView: RadListView = args.object;
    this.dataService.loadBlocks(this.page).subscribe((data) => {
      this.loading_blocks = false;
      this.blocks = data['results'];

      this.dataItems.push(data['results']);
      listView.notifyLoadOnDemandFinished();
      this.page++;
      args.returnValue = true;
     });
  }
}
