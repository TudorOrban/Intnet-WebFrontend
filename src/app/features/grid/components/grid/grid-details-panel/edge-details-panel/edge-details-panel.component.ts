import { Component } from '@angular/core';
import { GridStateService } from '../../../../services/ui/grid-state.service';
import { CommonModule } from '@angular/common';
import { DataFormatterService } from '../../../../../../shared/common/services/data-formatter.service';

@Component({
  selector: 'app-edge-details-panel',
  imports: [CommonModule],
  templateUrl: './edge-details-panel.component.html',
  styleUrl: './edge-details-panel.component.css'
})
export class EdgeDetailsPanelComponent {

    constructor(
        readonly gridStateService: GridStateService,
        readonly dataFormatterService: DataFormatterService
    ) {}

    metadataFields = [
        { label: "Grid ID", path: "gridId" },
        { label: "Edge Name", path: "edgeName" },
        { label: "Created at", path: "createdAt", type: "date" },
        { label: "Source Bus ID", path: "srcBusId" },
        { label: "Destination Bus ID", path: "destBusId" },
        { label: "Edge Type", path: "edgeType" },
    ];

    attributeFields = [
        { label: "Line Length", path: "lineLength" },
        { label: "Resistance", path: "resistance" },
        { label: "Reactance", path: "reactance" },
        { label: "Conductance", path: "conductance" },
        { label: "Susceptance", path: "susceptance" },
        { label: "Thermal Rating", path: "thermalRating" },
        { label: "Voltage Limits Min", path: "voltageLimitsMin" },
        { label: "Voltage Limits Max", path: "voltageLimitsMax" },
    ];

    getValue(item: any, path: string, type?: string): string {
        if (!item) {
            return "";
        }
        const value = path.split(".").reduce((acc, part) => acc && acc[part], item);
        if (type === "date") {
            return this.dataFormatterService.formatDate(value);
        }
        return value ?? "";
    }
}