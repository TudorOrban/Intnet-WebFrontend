import { Component } from '@angular/core';
import { GridStateService } from '../../../../services/ui/grid-state.service';
import { DataFormatterService } from '../../../../../../shared/common/services/data-formatter.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generator-details-panel',
  imports: [CommonModule],
  templateUrl: './generator-details-panel.component.html',
  styleUrl: './generator-details-panel.component.css'
})
export class GeneratorDetailsPanelComponent {

    constructor(
        readonly gridStateService: GridStateService,
        readonly dataFormatterService: DataFormatterService
    ) {}

    metadataFields = [
        { label: "Grid ID", path: "gridId" },
        { label: "Generator Name", path: "generatorName" },
        { label: "Created at", path: "createdAt", type: "date" },
        { label: "Generator Voltage Setpoint", path: "generatorVoltageSetpoint" },
        { label: "Generator Max Active Power", path: "generatorMaxActivePower" },
        { label: "Generator Min Active Power", path: "generatorMinActivePower" },
        { label: "Generator Max Reactive Power", path: "generatorMaxReactivePower" },
        { label: "Generator Min Reactive Power", path: "generatorMinReactivePower" },
    ];

    stateFields = [
        { label: "Last Updated", path: "state.updatedAt", type: "date" },
        { label: "Active Power Generation", path: "state.activePowerGeneration" },
        { label: "Reactive Power Generation", path: "state.reactivePowerGeneration" },
        { label: "Generator Voltage Setpoint", path: "state.generatorVoltageSetpoint" },
    ];

    getValue(item: any, path: string, type?: string): string {
        const value = path.split(".").reduce((acc, part) => acc && acc[part], item);
        if (type === "date") {
            return this.dataFormatterService.formatDate(value);
        }
        return value ?? "";
    }
}
