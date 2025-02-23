import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { BusSearchDto, CreateBusDto, UpdateBusDto } from "../models/Bus";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root"
})
export class BusService {
    private apiUrl = `${environment.apiUrl}/buses`;

    constructor(
        private http: HttpClient
    ) {}

    getBusesByGridId(gridId: number, attachComponents?: boolean): Observable<BusSearchDto[]> {
        return this.http.get<BusSearchDto[]>(`${this.apiUrl}/grid/${gridId}?attachComponents=${attachComponents ?? false}`);    
    }

    getBusById(id: number): Observable<BusSearchDto> {
        return this.http.get<BusSearchDto>(`${this.apiUrl}/${id}`);
    }

    createBus(busDto: CreateBusDto): Observable<BusSearchDto> {
        return this.http.post<BusSearchDto>(this.apiUrl, busDto);
    }
    
    updateBus(busDto: UpdateBusDto): Observable<BusSearchDto> {
        return this.http.put<BusSearchDto>(this.apiUrl, busDto);
    }

    deleteBus(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    
}