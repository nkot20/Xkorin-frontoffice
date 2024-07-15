import {Component, Input} from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-cci-evolution',
  templateUrl: './cci-evolution.component.html',
  styleUrls: ['./cci-evolution.component.scss'],
    standalone: true
})
export class CciEvolutionComponent {
    @Input() data: any[];


}
