import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../chart/chart.component';
import { DescriptionComponent } from '../description/description.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ChartComponent,
    DescriptionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
