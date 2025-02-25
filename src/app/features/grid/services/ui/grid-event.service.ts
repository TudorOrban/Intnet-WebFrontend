import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { NodeUI } from "../../models/Bus";
import { EdgeUI } from "../../models/Edge";

@Injectable({
    providedIn: "root"
})
export class GridEventService {
    mapClicked$ = new Subject<L.LeafletMouseEvent>();
    nodeClicked$ = new Subject<NodeUI>();
    nodeAdded$ = new Subject<NodeUI>();
    edgeAdded$ = new Subject<EdgeUI>();

    publishMapClicked(e: L.LeafletMouseEvent): void {
        this.mapClicked$.next(e);
    }

    publishNodeClicked(node: NodeUI): void {
        this.nodeClicked$.next(node);
    }

    publishNodeAdded(node: NodeUI): void {
        this.nodeAdded$.next(node);
    }

    publishEdgeAdded(edge: EdgeUI): void {
        this.edgeAdded$.next(edge);
    }
}