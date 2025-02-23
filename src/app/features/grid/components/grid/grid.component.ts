import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BusService } from '../../services/bus.service';
import { SelectedGridService } from '../../../../core/grid/services/selected-grid.service';
import { Subscription } from 'rxjs';
import { BusSearchDto } from '../../models/Bus';
import { GridMapComponent } from "./grid-map/grid-map.component";
import { EdgeService } from '../../services/edge.service';
import { EdgeSearchDto } from '../../models/Edge';

@Component({
  selector: 'app-grid',
  imports: [CommonModule, GridMapComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit, OnDestroy {
    gridId?: number;
    private subscription?: Subscription;

    buses?: BusSearchDto[];
    edges?: EdgeSearchDto[];

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
        })
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
