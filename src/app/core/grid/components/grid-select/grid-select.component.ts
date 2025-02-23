import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectedGridService } from '../../services/selected-grid.service';
import { GridSearchDto } from '../../models/Grid';
import { Subscription } from 'rxjs';
import { GridService } from '../../services/grid.service';
import { CommonModule } from '@angular/common';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-grid-select',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './grid-select.component.html',
  styleUrl: './grid-select.component.css'
})
export class GridSelectComponent implements OnInit, OnDestroy {
    grids?: GridSearchDto[];
    selectedGrid?: GridSearchDto;
    private subscription?: Subscription;
    isSelectOpen: boolean = false;

    constructor(
        private readonly gridService: GridService,
        private readonly selectedGridService: SelectedGridService
    ) {}
    
    ngOnInit(): void {
        this.subscription = this.selectedGridService.selectedGrid$.subscribe(grid => {
            this.selectedGrid = grid;
        });

        this.gridService.getGrids().subscribe(
            (data) => {
                this.grids = data;
                
                if ((this.grids?.length ?? 0) == 0) {
                    return;
                }

                this.selectedGridService.setGrids(this.grids);
                this.selectedGridService.selectGrid(this.grids?.[0]?.id);
            },
            (error) => {
                console.error("An error occurred fetching grids:", error);
            }
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    toggleIsSelectOpen(): void {
        this.isSelectOpen = !this.isSelectOpen;
    }

    selectGrid(gridId: number): void {
        this.selectedGridService.selectGrid(gridId);
        this.isSelectOpen = false;
    }

    addGrid(): void {

    }


    faPlus = faPlus;
}
