import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BusService } from '../../services/api/bus.service';
import { SelectedGridService } from '../../../../core/grid/services/selected-grid.service';
import { Subscription } from 'rxjs';
import { BusSearchDto, CreateBusDto } from '../../models/Bus';
import { GridMapComponent } from "./grid-map/grid-map.component";
import { EdgeService } from '../../services/api/edge.service';
import { CreateEdgeDto, EdgeSearchDto, EdgeType, TempEdgeUI } from '../../models/Edge';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDiagramProject, faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { UIItem } from '../../../../shared/common/types/Navigation';
import { gridAddOptions } from '../../config/gridAddOptions';
import { GridMapCommunicatorService } from '../../services/ui/grid-interaction.service';
import { SelectComponent } from "../../../../shared/common/components/select/select.component";

@Component({
  selector: 'app-grid',
  imports: [CommonModule, FontAwesomeModule, FormsModule, GridMapComponent, SelectComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit, OnDestroy {
    gridId?: number;
    private subscription?: Subscription;

    buses?: BusSearchDto[];
    edges?: EdgeSearchDto[];

    isAddMenuOpen: boolean = true;
    addOptions: UIItem[] = gridAddOptions;
    selectedAddOption?: string;

    createBusDto: CreateBusDto = { gridId: -1, latitude: 0, longitude: 0 };
    isCreateBusReady: boolean = false;

    createEdgeDto: CreateEdgeDto = { gridId: -1, srcBusId: -1, destBusId: -1, edgeType: EdgeType.TRANSMISSION };
    isCreateEdgeReady: boolean = false;
    edgeTypeOptions: UIItem[] = [
        { label: "Transmission Line", value: "TRANSMISSION", },
        { label: "Distribution Line", value: "DISTRIBUTION", },
        { label: "Transformer", value: "TRANSFORMER", },
    ];

    constructor(
        private readonly busService: BusService,
        private readonly edgeService: EdgeService,
        private readonly gridInteractionService: GridMapCommunicatorService,
        private readonly selectedGridService: SelectedGridService,
    ) {}

    ngOnInit(): void {
        this.subscription = this.selectedGridService.selectedGrid$.subscribe(grid => {
            if (!grid?.id) {
                return;
            }
            this.gridId = grid?.id;

            this.loadGridData();
        })
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private loadGridData(): void {
        if (!this.gridId) {
            return;
        }

        this.busService.getBusesByGridId(this.gridId, true).subscribe(
            (data) => {
                this.buses = data;
            }
        );
        this.edgeService.getEdgesByGridId(this.gridId).subscribe(
            (data) => {
                this.edges = data;
            }
        );
    }

    toggleAddMenu(): void {
        this.isAddMenuOpen = !this.isAddMenuOpen;
    }

    selectAddOption(optionValue: string) {
        this.selectedAddOption = optionValue;
    }

    // Node
    handleTempNodeAdded(tempNode: BusSearchDto): void {
        if (!this.gridId) {
            console.error("No Grid selected");
            return;
        }

        this.createBusDto.gridId = this.gridId;
        this.createBusDto.latitude = tempNode.latitude;
        this.createBusDto.longitude = tempNode.longitude;

        this.isCreateBusReady = true;
    }

    handleConfirmAddNode(): void {
        this.busService.createBus(this.createBusDto).subscribe(
            (data) => {
                console.log("Bus created successfuly: ", data);
            },
            (error) => {
                console.error("Error creating bus:", error);
            }
        );
    }

    handleCancelAddNode(): void {
        this.selectedAddOption = undefined;
        this.isCreateBusReady = false;
        this.gridInteractionService.cancelNodeCreation();
    }

    // Edge
    handleTempEdgeAdded(tempEdge: TempEdgeUI): void {
        if (!this.gridId) {
            console.error("No Grid selected");
            return;
        }

        this.createEdgeDto.gridId = this.gridId;
        this.createEdgeDto.srcBusId = tempEdge.srcBusId ?? 0;
        this.createEdgeDto.destBusId = tempEdge.destBusId ?? 0;
        
        this.isCreateEdgeReady = true;
    }

    handleConfirmAddEdge(): void {
        this.edgeService.createEdge(this.createEdgeDto).subscribe(
            (data) => {
                console.log("Edge created successfuly: ", data);
            },
            (error) => {
                console.error("Error creating edge:", error);
            }
        );
    }

    handleCancelAddEdge(): void {
        this.selectedAddOption = undefined;
        this.isCreateEdgeReady = false;
        this.gridInteractionService.cancelEdgeCreation();
    }

    handleEdgeTypeSelected(value: string): void {
        const edgeType = EdgeType[value as keyof typeof EdgeType];
        this.createEdgeDto.edgeType = edgeType;
    }

    faPlus = faPlus;
    faDiagramProject = faDiagramProject;
    faQuestion = faQuestion;
}
