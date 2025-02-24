import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class GridMapCommunicatorService {
    private cancelNodeCreationSubject = new Subject<void>();
    cancelNodeCreation$ = this.cancelNodeCreationSubject.asObservable();
    
    private cancelEdgeCreationSubject = new Subject<void>();
    cancelEdgeCreation$ = this.cancelEdgeCreationSubject.asObservable();

    cancelNodeCreation(): void {
        this.cancelNodeCreationSubject.next();
    }

    cancelEdgeCreation(): void {
        this.cancelEdgeCreationSubject.next();
    }
}