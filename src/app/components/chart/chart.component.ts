// src/app/components/chart/chart.component.ts
import { Component, OnInit }      from '@angular/core';
import { CommonModule }            from '@angular/common';
import { BaseChartDirective }      from 'ng2-charts';
import {
  TrelloDataService,
  TrelloResponse
} from '../../services/trello-data.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  chartData: any    = { labels: [], datasets: [] };
  chartOptions: any = { responsive: true };
  lastUpdated: Date | null = null;

  constructor(private trello: TrelloDataService) {}

  ngOnInit() {
    this.trello.getStats().subscribe((res: TrelloResponse) => {
      this.chartData = {
        labels: res.stats.map(s => s.list),
        datasets: [
          { data: res.stats.map(s => s.cards), label: 'Tasks' }
        ]
      };
      this.lastUpdated = new Date(res.updatedAt);
    });
  }
}
