import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { CreateGridDto, GridSearchDto, UpdateGridDto } from "../models/Grid";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class GridService {
    private apiUrl = `${environment.apiUrl}/grids`;

    constructor(
        private http: HttpClient
    ) {}

    getGrids(): Observable<GridSearchDto[]> {
        return this.http.get<GridSearchDto[]>(this.apiUrl);
    }

    createGrid(gridDto: CreateGridDto): Observable<GridSearchDto> {
        return this.http.post<GridSearchDto>(this.apiUrl, gridDto);
    }

    updateGrid(gridDto: UpdateGridDto): Observable<GridSearchDto> {
        return this.http.post<GridSearchDto>(this.apiUrl, gridDto);
    }

    deleteGrid(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}