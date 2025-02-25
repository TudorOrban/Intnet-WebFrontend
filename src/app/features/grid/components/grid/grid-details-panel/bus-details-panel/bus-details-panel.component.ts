import { Component } from '@angular/core';
import { GridStateService } from '../../../../services/ui/grid-state.service';
import { CommonModule } from '@angular/common';
import { DataFormatterService } from '../../../../../../shared/common/services/data-formatter.service';

@Component({
  selector: 'app-bus-details-panel',
  imports: [CommonModule],
  templateUrl: './bus-details-panel.component.html',
  styleUrl: './bus-details-panel.component.css'
})
export class BusDetailsPanelComponent {

    constructor(
        readonly gridStateService: GridStateService,
        readonly dataFormatterService: DataFormatterService
    ) {}

    metadataFields = [
        { label: "Grid ID", path: "gridId" },
        { label: "Bus Name", path: "busName" },
        { label: "Created at", path: "createdAt", type: "date" },
        { label: "Latitude", path: "latitude" },
        { label: "Longitude", path: "longitude" },
    ];

    stateFields = [
        { label: "Last Updated", path: "state.updatedAt", type: "date" },
        { label: "Voltage Magnitude", path: "state.voltageMagnitude" },
        { label: "Voltage Angle", path: "state.voltageAngle" },
        { label: "Active Power Injection", path: "state.activePowerInjection" },
        { label: "Reactive Power Injection", path: "state.reactivePowerInjection" },
        { label: "Phase Shifting Transformer Tap Position", path: "state.phaseShiftingTransformerTapPosition" },
    ];

    getValue(item: any, path: string, type?: string): string {
        const value = path.split(".").reduce((acc, part) => acc && acc[part], item);
        if (type === "date") {
            return this.dataFormatterService.formatDate(value);
        }
        return value ?? "";
    }
}
