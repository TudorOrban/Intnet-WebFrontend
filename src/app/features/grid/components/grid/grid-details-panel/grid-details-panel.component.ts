import { Component } from '@angular/core';
import { GridStateService } from '../../../services/ui/grid-state.service';

@Component({
  selector: 'app-grid-details-panel',
  imports: [],
  templateUrl: './grid-details-panel.component.html',
  styleUrl: './grid-details-panel.component.css'
})
export class GridDetailsPanelComponent {

    constructor(
        private readonly gridStateService: GridStateService
    ) {}

    
}
