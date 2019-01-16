import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services';
import { Router} from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";
import { RadListViewComponent } from "nativescript-ui-listview/angular";
import { ObservableArray } from "tns-core-modules/data/observable-array";

@Component({
  selector: 'app-block-details-tns',
  templateUrl: './block-details.component.tns.html',
  styleUrls: ['./block-details.component.tns.css']
})
export class BlockDetailsComponentTns implements OnInit {
  @ViewChild("myListView") myListViewComponent: RadListViewComponent;

  private _blockData: ObservableArray<any>;
  private _additionalData: ObservableArray<any>;
  private _myGroupingFunc: (item: any) => any;

  header: string;
  loading_block: boolean = false;

  constructor(
      private router: Router,
      private dataService: DataService,
      private route: ActivatedRoute,
      private routerExtensions: RouterExtensions,
      ) {
    this.myGroupingFunc = (item: any) => {
      return item.role;
    };
  }

  goBack() {
      this.routerExtensions.backToPreviousPage();
  }

  ngOnInit() {
    this.loading_block = true;
    this.route.params.subscribe( (params) => {
      this.dataService.loadBlock(params.hash).subscribe((blockItem) => {
        this.header = 'Block ' + blockItem.height;
        this._blockData = new ObservableArray([
          {name: 'Fee', value: blockItem.fee, additional: blockItem.fee !== 0 ? 'Groth' : ''},
          {name: 'Hash', value: blockItem.hash, additional: ''},
          {name: 'Difficulty', value: blockItem.difficulty.toLocaleString(), additional: ''},
          {name: 'Subsidy', value: blockItem.subsidy.toLocaleString(), additional: 'Groth'},
          {name: 'Chainwork', value: blockItem.chainwork, additional: ''},
          {name: 'Age', value: new Date(blockItem.timestamp).toLocaleDateString("en-US", {
            year: 'numeric', month: 'long',
            day: 'numeric', hour: 'numeric',
            minute: 'numeric', second: 'numeric' }), additional: ''}
        ]);

        let _addData = [];

        _addData = _addData.concat(blockItem.inputs.map((item) => {
          item['role'] = "Inputs";
          return item;
        }));
        _addData = _addData.concat(blockItem.outputs.map((item) => {
          item['role'] = "Outputs";
          return item;
        }));
        _addData = _addData.concat(blockItem.kernels.map((item) => {
          item['role'] = "Kernels";
          return item;
        }));
        this._additionalData = new ObservableArray(_addData);
        this.loading_block = false;
      });
    });
  }

  public templateSelector(item: any) {
    return item.role;
  }

  get blockData(): ObservableArray<any> {
    return this._blockData;
  }

  get additionalData(): ObservableArray<any> {
    return this._additionalData;
  }

  get myGroupingFunc(): (item: any) => any {
    return this._myGroupingFunc;
  }

  set myGroupingFunc(value: (item: any) => any) {
    this._myGroupingFunc = value;
  }
}
