import { Injectable } from "@angular/core";
import { GridSearchDto } from "../models/Grid";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class SelectedGridService {
    private grids?: GridSearchDto[];
    private selectedGridSubject = new BehaviorSubject<GridSearchDto | undefined>(undefined);
    selectedGrid$: Observable<GridSearchDto | undefined> = this.selectedGridSubject.asObservable();

    getGrids(): GridSearchDto[] | undefined {
        return this.grids;
    }

    setGrids(grids?: GridSearchDto[]): void {
        this.grids = grids;
    }

    getSelectedGrid(): GridSearchDto | undefined {
        return this.selectedGridSubject.value;
    }

    selectGrid(gridId: number): void {
        const selected = (this.grids ?? [])?.find(g => g.id === gridId);
        this.selectedGridSubject.next(selected);
    }
}