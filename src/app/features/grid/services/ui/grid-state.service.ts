import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { NodeUI } from "../../models/Bus";
import { EdgeUI } from "../../models/Edge";

@Injectable({
    providedIn: "root"
})
export class GridStateService {
    private nodesSubject = new BehaviorSubject<NodeUI[]>([]);
    nodes$ = this.nodesSubject.asObservable();

    private edgesSubject = new BehaviorSubject<EdgeUI[]>([]);
    edges$ = this.edgesSubject.asObservable();

    get nodes(): NodeUI[] {
        return this.nodesSubject.value;
    }

    get edges(): EdgeUI[] {
        return this.edgesSubject.value;
    }

    setNodes(nodes: NodeUI[]): void {
        this.nodesSubject.next(nodes);
    }

    setEdges(edges: EdgeUI[]): void {
        this.edgesSubject.next(edges);
    }

    addNode(node: NodeUI): void {
        const currentNodes = [...this.nodes];
        currentNodes.push(node);
        this.setNodes(currentNodes);
    }

    addEdge(edge: EdgeUI): void {
        const currentEdges = [...this.edges];
        currentEdges.push(edge);
        this.setEdges(currentEdges);
    }
}