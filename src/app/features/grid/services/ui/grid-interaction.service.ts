import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BusSearchDto } from "../../models/Bus";
import { EdgeSearchDto } from "../../models/Edge";

@Injectable({
    providedIn: "root"
})
export class GridMapCommunicatorService {
    private successNodeCreationSubject = new Subject<BusSearchDto>();
    successNodeCreation$ = this.successNodeCreationSubject.asObservable();

    successNodeCreation(node: BusSearchDto): void {
        this.successNodeCreationSubject.next(node);
    }

    private cancelNodeCreationSubject = new Subject<void>();
    cancelNodeCreation$ = this.cancelNodeCreationSubject.asObservable();
    
    cancelNodeCreation(): void {
        this.cancelNodeCreationSubject.next();
    }

    private successEdgeCreationSubject = new Subject<EdgeSearchDto>();
    successEdgeCreation$ = this.successEdgeCreationSubject.asObservable();

    successEdgeCreation(edge: EdgeSearchDto): void {
        this.successEdgeCreationSubject.next(edge);
    }

    private cancelEdgeCreationSubject = new Subject<void>();
    cancelEdgeCreation$ = this.cancelEdgeCreationSubject.asObservable();

    cancelEdgeCreation(): void {
        this.cancelEdgeCreationSubject.next();
    }
}