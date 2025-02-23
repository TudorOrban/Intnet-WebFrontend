import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { GeneratorSearchDto, CreateGeneratorDto, UpdateGeneratorDto } from "../models/Generator";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root"
})
export class GeneratorService {
    private apiUrl = `${environment.apiUrl}/generators`;

    constructor(
        private http: HttpClient
    ) {}

    getGeneratorsByGridId(gridId: number): Observable<GeneratorSearchDto[]> {
        return this.http.get<GeneratorSearchDto[]>(`${this.apiUrl}/grid/${gridId}`);    
    }

    getGeneratorById(id: number): Observable<GeneratorSearchDto> {
        return this.http.get<GeneratorSearchDto>(`${this.apiUrl}/${id}`);
    }

    createGenerator(generatorDto: CreateGeneratorDto): Observable<GeneratorSearchDto> {
        return this.http.post<GeneratorSearchDto>(this.apiUrl, generatorDto);
    }
    
    updateGenerator(generatorDto: UpdateGeneratorDto): Observable<GeneratorSearchDto> {
        return this.http.put<GeneratorSearchDto>(this.apiUrl, generatorDto);
    }

    deleteGenerator(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    
}