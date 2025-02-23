import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { EdgeSearchDto, CreateEdgeDto, UpdateEdgeDto } from "../models/Edge";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root"
})
export class EdgeService {
    private apiUrl = `${environment.apiUrl}/edges`;

    constructor(
        private http: HttpClient
    ) {}

    getEdgesByGridId(gridId: number): Observable<EdgeSearchDto[]> {
        return this.http.get<EdgeSearchDto[]>(`${this.apiUrl}/grid/${gridId}`);    
    }

    getEdgeById(id: number): Observable<EdgeSearchDto> {
        return this.http.get<EdgeSearchDto>(`${this.apiUrl}/${id}`);
    }

    createEdge(edgeDto: CreateEdgeDto): Observable<EdgeSearchDto> {
        return this.http.post<EdgeSearchDto>(this.apiUrl, edgeDto);
    }
    
    updateEdge(edgeDto: UpdateEdgeDto): Observable<EdgeSearchDto> {
        return this.http.put<EdgeSearchDto>(this.apiUrl, edgeDto);
    }

    deleteEdge(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    
}