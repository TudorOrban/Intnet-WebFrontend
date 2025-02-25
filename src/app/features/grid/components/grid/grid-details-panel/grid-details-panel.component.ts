import { Component } from '@angular/core';
import { GridStateService } from '../../../services/ui/grid-state.service';
import { CommonModule } from '@angular/common';
import { GridDetailsService } from '../../../services/ui/map-wrapper/grid-details.service';
import { BusDetailsPanelComponent } from "./bus-details-panel/bus-details-panel.component";
import { EdgeDetailsPanelComponent } from "./edge-details-panel/edge-details-panel.component";
import { GeneratorDetailsPanelComponent } from "./generator-details-panel/generator-details-panel.component";

@Component({
  selector: 'app-grid-details-panel',
  imports: [CommonModule, BusDetailsPanelComponent, EdgeDetailsPanelComponent, GeneratorDetailsPanelComponent],
  templateUrl: './grid-details-panel.component.html',
  styleUrl: './grid-details-panel.component.css'
})
export class GridDetailsPanelComponent {

    constructor(
        readonly gridStateService: GridStateService,
        private readonly gridDetailsService: GridDetailsService,
    ) {}


}
