import { Component, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle, ApexStroke, ApexFill, ApexMarkers, ApexGrid, ApexDataLabels, ApexTooltip, ApexYAxis
} from 'ng-apexcharts';
import {DeviceDetectorService} from "ngx-device-detector";
import {DataService} from "../../../services";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  fill: ApexFill;
  markers: ApexMarkers;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  yaxis: ApexYAxis;
  colors: any;
};

@Component({
  selector: 'app-top-chart',
  templateUrl: './top-chart.component.html',
  styleUrls: ['./top-chart.component.scss']
})
export class TopChartComponent {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public isMobile = this.deviceService.isMobile();

  constructor(private deviceService: DeviceDetectorService, private dataService: DataService) {


    const data = this.dataService.loadTopChart().subscribe((data) => {
      this.chartOptions = {
      series: [{
        name: 'Transactions',
        data: data.data.data,
      }],
      chart: {
        foreColor: 'rgba(255, 255, 255, 0.65)',
        height: 310,
        type: 'area',
        zoom: {
          enabled: !1
        },
        toolbar: {
          show: false
        },
        dropShadow: {
          enabled: !0,
          top: 3,
          left: 14,
          blur: 4,
          opacity: .1
        }
      },
      stroke: {
        width: 5,
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        categories: data.data.categories,
      },
      title: {
        text: '',
        align: 'left',
        style: {
          fontSize: '16px',
          color: '#fff'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          gradientToColors: ['#fff'],
          shadeIntensity: 1,
          type: 'vertical',
          opacityFrom: .7,
          opacityTo: .2,
          stops: [0, 100, 100, 100]
        }
      },
      markers: {
        size: 5,
        colors: ['#000'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      grid: {
        borderColor: 'rgba(255, 255, 255, 0.12)',
        show: true,
      },
      dataLabels: {
        enabled: !1
      },
      tooltip: {
        theme: 'dark',
        fixed: {
          enabled: !1
        },
        x: {
          show: !0
        },
        y: {
          formatter(e) {
            return ' ' + e + ' ';
          }
        },
        marker: {
          show: !1
        }
      },
      colors: ['#fff'],
      yaxis: {
        title: {
          text: 'Transactions',
        },
      }
    };
    });

  }
}
