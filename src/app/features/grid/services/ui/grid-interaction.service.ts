import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BusSearchDto } from "../../models/Bus";
import { EdgeSearchDto } from "../../models/Edge";
import { GeneratorSearchDto } from "../../models/Generator";

@Injectable({
    providedIn: "root"
})
export class GridMapCommunicatorService {
    private successNodeCreationSubject = new Subject<BusSearchDto>();
    successNodeCreation$ = this.successNodeCreationSubject.asObservable();
    private cancelNodeCreationSubject = new Subject<void>();
    cancelNodeCreation$ = this.cancelNodeCreationSubject.asObservable();

    private successEdgeCreationSubject = new Subject<EdgeSearchDto>();
    successEdgeCreation$ = this.successEdgeCreationSubject.asObservable();
    private cancelEdgeCreationSubject = new Subject<void>();
    cancelEdgeCreation$ = this.cancelEdgeCreationSubject.asObservable();

    private successGeneratorCreationSubject = new Subject<GeneratorSearchDto>();
    successGeneratorCreation$ = this.successGeneratorCreationSubject.asObservable();
    private cancelGeneratorCreationSubject = new Subject<void>();
    cancelGeneratorCreation$ = this.cancelGeneratorCreationSubject.asObservable();

    successNodeCreation(node: BusSearchDto): void {
        this.successNodeCreationSubject.next(node);
    }

    cancelNodeCreation(): void {
        this.cancelNodeCreationSubject.next();
    }

    successEdgeCreation(edge: EdgeSearchDto): void {
        this.successEdgeCreationSubject.next(edge);
    }

    cancelEdgeCreation(): void {
        this.cancelEdgeCreationSubject.next();
    }

    successGeneratorCreation(generator: GeneratorSearchDto): void {
        this.successGeneratorCreationSubject.next(generator);
    }

    cancelGeneratorCreation(): void {
        this.cancelGeneratorCreationSubject.next();
    }
}