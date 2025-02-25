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
import { faDiagramProject, faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { UIItem } from '../../../../shared/common/types/Navigation';
import { gridAddOptions } from '../../config/gridAddOptions';
import { SelectComponent } from "../../../../shared/common/components/select/select.component";
import { GridElementCreationService } from '../../services/ui/map-wrapper/grid-element-creation.service';

@Component({
  selector: 'app-grid',
  imports: [CommonModule, FontAwesomeModule, FormsModule, GridMapComponent, SelectComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit, OnDestroy {
    gridId?: number;
    private gridIdSubscription?: Subscription;

    buses?: BusSearchDto[];
    edges?: EdgeSearchDto[];

    isAddMenuOpen: boolean = true;
    addOptions: UIItem[] = gridAddOptions;

    constructor(
        private readonly busService: BusService,
        private readonly edgeService: EdgeService,
        private readonly selectedGridService: SelectedGridService,
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

    toggleAddMenu(): void {
        this.isAddMenuOpen = !this.isAddMenuOpen;
    }

    // Utils
    getAddOptionInfo(): string | undefined {
        const selectedOption = this.elementCreationService.getSelectedAddOption();
        const addOption = this.addOptions.find(o => o.value === selectedOption);
        return addOption?.info;
    }

    faPlus = faPlus;
    faDiagramProject = faDiagramProject;
    faQuestion = faQuestion;
}
