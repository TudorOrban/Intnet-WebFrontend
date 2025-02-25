import { Component } from '@angular/core';
import { GridStateService } from '../../../../services/ui/grid-state.service';
import { CommonModule } from '@angular/common';
import { LabelValueComponent } from "../../../../../../shared/common/components/label-value/label-value.component";

@Component({
  selector: 'app-bus-details-panel',
  imports: [CommonModule, LabelValueComponent],
  templateUrl: './bus-details-panel.component.html',
  styleUrl: './bus-details-panel.component.css'
})
export class BusDetailsPanelComponent {

    constructor(
        readonly gridStateService: GridStateService,
    ) {}


}
