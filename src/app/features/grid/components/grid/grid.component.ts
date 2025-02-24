import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BusService } from '../../services/bus.service';
import { SelectedGridService } from '../../../../core/grid/services/selected-grid.service';
import { Subscription } from 'rxjs';
import { BusSearchDto, CreateBusDto } from '../../models/Bus';
import { GridMapComponent } from "./grid-map/grid-map.component";
import { EdgeService } from '../../services/edge.service';
import { EdgeSearchDto } from '../../models/Edge';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDiagramProject, faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { UIItem } from '../../../../shared/common/types/Navigation';
import { gridAddOptions } from '../../config/gridAddOptions';

@Component({
  selector: 'app-grid',
  imports: [CommonModule, FontAwesomeModule, GridMapComponent],
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
    cancelCreateBusFlag = false;

    constructor(
        private readonly busService: BusService,
        private readonly edgeService: EdgeService,
        private readonly selectedGridService: SelectedGridService
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
                console.log("Data", data);
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
        this.cancelCreateBusFlag = true;
    }

    faPlus = faPlus;
    faDiagramProject = faDiagramProject;
    faQuestion = faQuestion;
}
