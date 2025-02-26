import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BusService } from '../../services/api/bus.service';
import { SelectedGridService } from '../../../../core/grid/services/selected-grid.service';
import { Subscription } from 'rxjs';
import { BusSearchDto } from '../../models/Bus';
import { GridMapComponent } from "./grid-map/grid-map.component";
import { EdgeService } from '../../services/api/edge.service';
import { EdgeSearchDto } from '../../models/Edge';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddElementPanelComponent } from "./add-element-panel/add-element-panel.component";
import { GridHeaderComponent } from "./grid-header/grid-header.component";
import { GridStateService } from '../../services/ui/grid-state.service';
import { GridDetailsPanelComponent } from "./grid-details-panel/grid-details-panel.component";
import { GridElementCreationService } from '../../services/ui/element-creation/grid-element-creation.service';

@Component({
  selector: 'app-grid',
  imports: [CommonModule, FontAwesomeModule, FormsModule, GridMapComponent, AddElementPanelComponent, GridHeaderComponent, GridDetailsPanelComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit, OnDestroy {
    gridId?: number;
    private gridIdSubscription?: Subscription;

    buses?: BusSearchDto[];
    edges?: EdgeSearchDto[];

    constructor(
        private readonly busService: BusService,
        private readonly edgeService: EdgeService,
        private readonly selectedGridService: SelectedGridService,
        readonly gridStateService: GridStateService,
        readonly elementCreationService: GridElementCreationService,
    ) {}

    ngOnInit(): void {
        this.gridIdSubscription = this.selectedGridService.selectedGrid$.subscribe(grid => {
            if (!grid?.id) {
                return;
            }
            this.gridId = grid?.id;
            this.elementCreationService.setGridId(grid?.id);

            this.loadGridData();
        })
    }

    ngOnDestroy(): void {
        if (this.gridIdSubscription) {
            this.gridIdSubscription.unsubscribe();
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

}
