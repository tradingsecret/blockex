import {
  Component,
  OnInit,
  ViewEncapsulation,
  SimpleChanges,
  Input,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { WebsocketService } from '../../../../modules/websocket';
import { WS } from '../../../../websocket.events';
import { Observable } from 'rxjs';

import { Chart } from 'angular-highcharts';
import { DeviceDetectorService } from 'ngx-device-detector';

export interface IGraphs {
  items: {
    fee: number;
    difficulty: number;
    hashrate: number;
    date: string;
    blocks_count: number;
  }[];
  avg_blocks: number;
}

const LOG_MIN_VALUE = 0.001;
const DAY_TICK = 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GraphsComponent implements OnInit, OnDestroy {
  @Input() activeCurrency: string;

  private subscriber: any;
  public graphsData$: Observable<IGraphs>;
  public graphsLoaded = false;
  public graphs = {
    blocks: null,
    blocks1: null,
    transactions: null,
    transactions1: null
  };
  public blockCharts = [
    {
      num: 1,
      name: 'BLOCKS AND DIFFICULTY',
      tooltip: 'Average difficulty',
      isSelected: true
    }, {
      num: 0,
      name: 'BLOCKS AND HASH RATE',
      tooltip: 'Average hash rate',
      isSelected: false
    }
  ];

  public trCharts = [
    {
      num: 1,
      name: 'OFFERED VOLUME',
      isSelected: true
    }, {
      num: 0,
      name: 'TRANSACTIONS AMOUNT',
      isSelected: false
    }
  ];
  public isChartTypesVisible = false;
  public isChartTypesSecondVisible = false;
  public selectedBlocksChartType = this.blockCharts[0];
  public selectedTrChartType = this.trCharts[0];
  private lastConstructedGraphs: any;
  private swapChartStates = {
    USD: {
      y_title: 'Amount, USD',
    },
    BTC: {
      y_title: 'Amount, BTC',
    }
  };
  public isMobile = this.deviceService.isMobile();

  @HostListener('document:click', ['$event']) clickout(event: any) {
    this.isChartTypesVisible = false;
    this.isChartTypesSecondVisible = false;
  }

  constructor(
      private deviceService: DeviceDetectorService,
      private wsService: WebsocketService) {
    this.wsService.publicStatus.subscribe((isConnected) => {
      if (isConnected) {
        this.wsService.send(WS.INIT.INIT_GRAPHS);
      }
    });
    this.graphsData$ = this.wsService.on<IGraphs>(WS.INIT.INIT_GRAPHS, WS.UPDATE.UPDATE_GRAPHS);
  }

  tooltipFormatter = function() {
    const date = new Date(this.x);
    let maximumFractionDigits = 0;
    if (this.series.name === 'BTC' ||
      this.series.name === 'LTC' ||
      this.series.name === 'DOGE' ||
      this.series.name === 'DASH' ||
      this.series.name === 'WBTC' ||
      this.series.name === 'USDT' ||
      this.series.name === 'ETH' ||
      this.series.name === 'DAI' ||
      this.series.name === 'QTUM') {
        maximumFractionDigits = 8;
    }
    return '<div class="chart-tooltip-container">' +
      '<span class="tooltip-line-color">\u2015\u2015</span>' +
      '<div class="tooltip-line-circle"></div>' +
      '<div class="tooltip-title">' + this.series.name + '</div>' +
      '<div class="tooltip-date">' + date.getDate() + ' ' +
          new Intl.DateTimeFormat('en-US', {month: 'long'}).format(date) + ' ' +
          date.getFullYear() + ', ' + (date.getHours() < 10 ? '0' : '') + date.getHours()
          + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()  + '</div>' +
      '<div class="tooltip-value">' + this.y.toLocaleString('en-US', {maximumFractionDigits}) + '</div></div>';
  };

  xAxisFormatter = function() {
    const date = new Date(this.value);
    return new Intl.DateTimeFormat('en-US', {month: 'short'}).format(date)
      + ' ' + date.getDate();
  };

  feeYAxisFormatter = function() {
    if (this.value === LOG_MIN_VALUE || this.isFirst) {
      return '0';
    }

    let res = '';
    if (this.value >= 1000) {
        const suffixes = ['', '', 'M', 'M', 'T', 'T'];
        const suffixNum = Math.floor(('' + this.value).length / 3);
        let shortValue;
        for (let precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat((suffixNum !== 0
              ? (this.value / Math.pow(1000, suffixNum))
              : this.value).toPrecision(precision));
            const dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 !== 0) {
          shortValue = shortValue.toFixed(1);
        }
        res = (suffixNum === 1 || suffixNum === 3 ? shortValue * 1000 : shortValue) + suffixes[suffixNum];
    }
    return res;
  };

  graphsInit(graphs): void {
    this.graphs.blocks = new Chart({
      title: {
        text: '',
      },
      chart: {
        shadow: false,
        height: 450,
        ignoreHiddenSeries: false,
        type: 'spline',
        styledMode: true,
        borderRadius: 20
      },
      credits: {
          enabled: false
      },
      exporting: {
        buttons: {
          contextButton: {
              enabled: false
          }
        }
      },
      yAxis: [{
        min: 0,
        title: {
          rotation: 270,
          text: '',
          margin: 34
        }
      }],
      xAxis: {
        minorTickLength: 0,
        tickLength: 0,
        type: 'datetime',
        minTickInterval: DAY_TICK,
        labels: {
          formatter: this.xAxisFormatter,
        }
      },
      legend: {
        width: 350,
        itemWidth: 350,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        x: 40,
        y: 10,
        accessibility: {
          enabled: false,
        },
      },
      plotOptions: {
        series: {
          events: {
            // tslint:disable-next-line:only-arrow-functions typedef
            legendItemClick() {
              return false;
            }
          }
        }
      },
      tooltip: {
        followPointer: false,
        useHTML: true,
        borderRadius: 20,
        shadow: false,
        formatter: this.tooltipFormatter
      },
      series: [{
        type: 'spline',
        marker: {
          enabledThreshold: 0,
          radius: 2,
          symbol: 'circle',
        },
        name: 'Average difficulty',
        data: graphs.difficulty,
        yAxis: 0
      }, ],
    });

    this.graphs.blocks1 = new Chart({
      title: {
        text: '',
      },
      chart: {
        shadow: false,
        height: 450,
        ignoreHiddenSeries: false,
        type: 'spline',
        styledMode: true
      },
      credits: {
        enabled: false
      },
      exporting: {
        buttons: {
          contextButton: {
            enabled: false
          }
        }
      },
      yAxis: [{
        title: {
          text: this.isMobile ? '' : '',
          margin: 34
        }
      }, ],
      xAxis: {
        minorTickLength: 0,
        tickLength: 0,
        type: 'datetime',
        minTickInterval: DAY_TICK,
        labels: {
          formatter: this.xAxisFormatter,
        }
      },
      legend: {
        width: 380,
        itemWidth: 380,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        x: 40,
        y: 10
      },
      plotOptions: {
        series: {
          events: {
            // tslint:disable-next-line:only-arrow-functions typedef
            legendItemClick() {
              return false;
            }
          }
        }
      },
      tooltip: {
        followPointer: false,
        useHTML: true,
        borderRadius: 20,
        shadow: false,
        formatter: this.tooltipFormatter
      },
      series: [{
        type: 'spline',
        marker: {
          enabledThreshold: 0,
          radius: 2,
          symbol: 'circle',
        },
        name: 'Blocks per hour',
        data: graphs.blocks
      }],
    });

    this.graphs.transactions = new Chart({
      title: {
        text: '',
      },
      chart: {
        shadow: false,
        height: 450,
        ignoreHiddenSeries: false,
        type: 'spline',
        styledMode: true,
      },
      credits: {
          enabled: false
      },
      exporting: {
        buttons: {
          contextButton: {
              enabled: false
          }
        }
      },
      yAxis: [{
        lineColor: '#ff51ff',
        title: {
          text: this.isMobile ? '' : '',
          margin: 34
        },
      }],
      xAxis: {
        minorTickLength: 0,
        tickLength: 0,
        type: 'datetime',
        minTickInterval: DAY_TICK,
        labels: {
          formatter: this.xAxisFormatter,
        },
      },
      legend: {
        width: 450,
        itemWidth: 450,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        x: 40,
        y: 10,
      },
      plotOptions: {
        series: {
          events: {
            // tslint:disable-next-line:only-arrow-functions typedef
            legendItemClick() {
              return false;
            }
          }
        }
      },
      tooltip: {
        followPointer: false,
        useHTML: true,
        borderRadius: 20,
        shadow: false,
        formatter: this.tooltipFormatter
      },
      series: [{
        type: 'spline',
        marker: {
          enabledThreshold: 0,
          radius: 2,
          symbol: 'circle',
        },
        name: 'Regular transactions amount',
        data: graphs.transactions
      }, ],
    });

    this.graphs.transactions1 = new Chart({
      title: {
        text: '',
      },
      chart: {
        shadow: false,
        height: 450,
        ignoreHiddenSeries: false,
        type: 'spline',
        styledMode: true
      },
      credits: {
          enabled: false
      },
      exporting: {
        buttons: {
          contextButton: {
              enabled: false
          }
        }
      },
      yAxis: [{
        title: {
          text: this.isMobile ? '' : '',
          margin: 34
        }
      }],
      xAxis: {
        minorTickLength: 0,
        tickLength: 0,
        type: 'datetime',
        minTickInterval: DAY_TICK,
        labels: {
          formatter: this.xAxisFormatter,
        }
      },
      legend: {
        width: 450,
        itemWidth: 450,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        x: 40,
        y: 10
      },
      plotOptions: {
        series: {
          events: {
            // tslint:disable-next-line:only-arrow-functions typedef
            legendItemClick() {
              return false;
            }
          }
        }
      },
      tooltip: {
        followPointer: false,
        useHTML: true,
        borderRadius: 20,
        shadow: false,
        formatter: this.tooltipFormatter
      },
      series: [{
        type: 'spline',
        marker: {
          enabledThreshold: 0,
          radius: 2,
          symbol: 'circle',
        },
        name: 'Shielded transactions amount',
        data: graphs.lelantus_trs
      }],
    });
  }

  formatDateForGraph(date) {
    return new Date(date.replace(' ', 'T')).getTime();
  }

  constructGraphsData(data) {
    const graphsData = {
      blocks: [],
      difficulty: [],
      hashrate: [],
      fee: [],
      fixed: [],
      averageBlocks: [],
      lelantus: [],
      swaps_btc_usd: [],
      swaps_dash_usd: [],
      swaps_doge_usd: [],
      swaps_wbtc_usd: [],
      swaps_usdt_usd: [],
      swaps_eth_usd: [],
      swaps_dai_usd: [],
      swaps_ltc_usd: [],
      swaps_qtum_usd: [],
      swaps_btc_btc: [],
      swaps_dash_btc: [],
      swaps_doge_btc: [],
      swaps_wbtc_btc: [],
      swaps_usdt_btc: [],
      swaps_eth_btc: [],
      swaps_dai_btc: [],
      swaps_ltc_btc: [],
      swaps_qtum_btc: [],
      transactions: [],
      lelantus_trs: []
    };

    data.items.forEach(element => {
      const dateValue = this.formatDateForGraph(element.date);
      graphsData.blocks.push([dateValue, element.blocks_count]);
      graphsData.difficulty.push([dateValue, element.difficulty]);
      graphsData.fee.push([dateValue, element.fee === 0 ? LOG_MIN_VALUE : element.fee]);
      graphsData.fixed.push([dateValue, 60]);
      graphsData.hashrate.push([dateValue, element.hashrate]);
      graphsData.averageBlocks.push([dateValue, data.avg_blocks]);
      graphsData.transactions.push([dateValue, element.transactions.kernels__count]);
    });

    data.lelantus.forEach(element => {
      const dateValue = this.formatDateForGraph(element[0]);
      graphsData.lelantus.push([dateValue, parseFloat(element[1])]);
    });

    data.lelantus_trs.forEach(element => {
      const dateValue = this.formatDateForGraph(element[0]);
      graphsData.lelantus_trs.push([dateValue, parseFloat(element[1])]);
    });

    data.swap_stats.forEach(element => {
      const dateValue = this.formatDateForGraph(element[0]);
      graphsData.swaps_btc_usd.push([dateValue, parseFloat(element[1].usd.bitcoin)]);
      graphsData.swaps_dash_usd.push([dateValue, parseFloat(element[1].usd.dash)]);
      graphsData.swaps_doge_usd.push([dateValue, parseFloat(element[1].usd.dogecoin)]);
      graphsData.swaps_ltc_usd.push([dateValue, parseFloat(element[1].usd.litecoin)]);
      graphsData.swaps_qtum_usd.push([dateValue, parseFloat(element[1].usd.qtum)]);
      graphsData.swaps_wbtc_usd.push([dateValue, parseFloat(element[1].usd.wbtc)]);
      graphsData.swaps_eth_usd.push([dateValue, parseFloat(element[1].usd.eth)]);
      graphsData.swaps_usdt_usd.push([dateValue, parseFloat(element[1].usd.usdt)]);
      graphsData.swaps_dai_usd.push([dateValue, parseFloat(element[1].usd.dai)]);

      graphsData.swaps_btc_btc.push([dateValue, parseFloat(element[1].btc.bitcoin)]);
      graphsData.swaps_dash_btc.push([dateValue, parseFloat(element[1].btc.dash)]);
      graphsData.swaps_doge_btc.push([dateValue, parseFloat(element[1].btc.dogecoin)]);
      graphsData.swaps_ltc_btc.push([dateValue, parseFloat(element[1].btc.litecoin)]);
      graphsData.swaps_qtum_btc.push([dateValue, parseFloat(element[1].btc.qtum)]);
      graphsData.swaps_wbtc_btc.push([dateValue, parseFloat(element[1].btc.wbtc)]);
      graphsData.swaps_eth_btc.push([dateValue, parseFloat(element[1].btc.eth)]);
      graphsData.swaps_usdt_btc.push([dateValue, parseFloat(element[1].btc.usdt)]);
      graphsData.swaps_dai_btc.push([dateValue, parseFloat(element[1].btc.dai)]);
    });

    this.lastConstructedGraphs = JSON.parse(JSON.stringify(graphsData));
    return graphsData;
  }

  ngOnInit(): void {
    this.subscriber = this.graphsData$.subscribe((data) => {
      const graphsConstructed = this.constructGraphsData(data);
      if (this.graphsLoaded) {
        this.graphs.blocks.ref$.subscribe((blockChart) => {
          blockChart.series[0].setData(graphsConstructed.difficulty);
        });
        this.graphs.blocks1.ref$.subscribe((blockChart) => {
          blockChart.series[0].setData(graphsConstructed.blocks);
        });

        this.graphs.transactions.ref$.subscribe((trChart) => {
          trChart.series[0].setData(graphsConstructed.transactions);
        });

        this.graphs.transactions1.ref$.subscribe((trChart) => {
          trChart.series[0].setData(graphsConstructed.lelantus_trs);
        });
      } else {
        this.graphsInit(graphsConstructed);
        this.graphsLoaded = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.graphsLoaded = false;
    this.subscriber.unsubscribe();
  }

  swapChartUpdate(swapsChart, state) {
    swapsChart.series[0].setData(state === this.swapChartStates.BTC ?
      this.lastConstructedGraphs.swaps_btc_btc : this.lastConstructedGraphs.swaps_btc_usd);
    swapsChart.series[1].setData(state === this.swapChartStates.BTC ?
      this.lastConstructedGraphs.swaps_dash_btc : this.lastConstructedGraphs.swaps_dash_usd);
    swapsChart.series[2].setData(state === this.swapChartStates.BTC ?
      this.lastConstructedGraphs.swaps_doge_btc : this.lastConstructedGraphs.swaps_doge_usd);
    swapsChart.series[3].setData(state === this.swapChartStates.BTC ?
      this.lastConstructedGraphs.swaps_ltc_btc : this.lastConstructedGraphs.swaps_ltc_usd);
    swapsChart.series[4].setData(state === this.swapChartStates.BTC ?
      this.lastConstructedGraphs.swaps_qtum_btc : this.lastConstructedGraphs.swaps_qtum_usd);
    swapsChart.series[5].setData(state === this.swapChartStates.BTC ?
      this.lastConstructedGraphs.swaps_wbtc_btc : this.lastConstructedGraphs.swaps_wbtc_usd);
    swapsChart.series[6].setData(state === this.swapChartStates.BTC ?
      this.lastConstructedGraphs.swaps_eth_btc : this.lastConstructedGraphs.swaps_eth_usd);
    swapsChart.series[7].setData(state === this.swapChartStates.BTC ?
      this.lastConstructedGraphs.swaps_usdt_btc : this.lastConstructedGraphs.swaps_usdt_usd);
    swapsChart.series[8].setData(state === this.swapChartStates.BTC ?
      this.lastConstructedGraphs.swaps_dai_btc : this.lastConstructedGraphs.swaps_dai_usd);
    swapsChart.yAxis[0].update({
      title: {
          text: state.y_title
      }
    });
    swapsChart.redraw();
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  showTypesSecondOptions(event) {
    event.stopPropagation();
    this.isChartTypesSecondVisible = !this.isChartTypesSecondVisible;
  }

  trChartTypeChange(selectedType) {
    if (!selectedType.isSelected) {
      selectedType.isSelected = true;
      this.selectedTrChartType.isSelected = false;
      this.selectedTrChartType = selectedType;
    }
  }

  showTypesOptions(event): void {
    event.stopPropagation();
    this.isChartTypesVisible = !this.isChartTypesVisible;
  }

  blocksChartTypeChange(selectedType): void {
  }
}
