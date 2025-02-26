import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { NodeUI } from "../../models/Bus";
import { EdgeUI } from "../../models/Edge";
import { GridComponentState } from "../../models/GridComponentState";
import { GeneratorUI } from "../../models/Generator";

@Injectable({
    providedIn: "root"
})
export class GridStateService {
    private initialState: GridComponentState = {
        gridData: { nodes: [], edges: [] },
        gridModes: { isAddModeOn: false, isEditModeOn: false, isDeleteModeOn: false },
        gridSelection: { selectedNode: undefined, selectedEdge: undefined, selectedGenerator: undefined }
    }

    private stateSubject = new BehaviorSubject<GridComponentState>(this.initialState);
    state$ = this.stateSubject.asObservable();

    get state(): GridComponentState {
        return this.stateSubject.value;
    }

    set state(newState: GridComponentState) {
        this.stateSubject.next(newState);
    }

    get nodes(): NodeUI[] {
        return this.state.gridData.nodes;
    }

    get edges(): EdgeUI[] {
        return this.state.gridData.edges;
    }

    get isAddModeOn(): boolean {
        return this.state.gridModes.isAddModeOn;
    }

    get isEditModeOn(): boolean {
        return this.state.gridModes.isEditModeOn;
    }

    get isDeleteModeOn(): boolean {
        return this.state.gridModes.isDeleteModeOn;
    }

    get selectedNode(): NodeUI | undefined {
        return this.state.gridSelection.selectedNode;
    }

    get selectedEdge(): EdgeUI | undefined {
        return this.state.gridSelection.selectedEdge;
    }

    get selectedGenerator(): GeneratorUI | undefined {
        return this.state.gridSelection.selectedGenerator;
    }

    setNodes(nodes: NodeUI[]): void {
        this.state = { ...this.state, gridData: { ...this.state.gridData, nodes } };
    }

    setEdges(edges: EdgeUI[]): void {
        this.state = { ...this.state, gridData: { ...this.state.gridData, edges } };
    }

    addNode(node: NodeUI): void {
        this.state = { ...this.state, gridData: { ...this.state.gridData, nodes: [...this.state.gridData.nodes, node] } };
    }

    addEdge(edge: EdgeUI): void {
        this.state = { ...this.state, gridData: { ...this.state.gridData, edges: [...this.state.gridData.edges, edge] } };
    }

    updateNode(updatedNode: NodeUI): void {
        const updatedNodes = this.state.gridData.nodes.map(node =>
            node.id === updatedNode.id ? updatedNode : node
        );

        this.state = { ...this.state, gridData: { ...this.state.gridData, nodes: updatedNodes } };
    }
    
    toggleAddMode(): void {
        this.state = { ...this.state, gridModes: { ...this.state.gridModes, isAddModeOn: !this.state.gridModes.isAddModeOn } };
    }

    toggleEditMode(): void {
        this.state = { ...this.state, gridModes: { ...this.state.gridModes, isEditModeOn: !this.state.gridModes.isEditModeOn } };
    }

    toggleDeleteMode(): void {
        this.state = { ...this.state, gridModes: { ...this.state.gridModes, isDeleteModeOn: !this.state.gridModes.isDeleteModeOn } };
    }

    setSelectedNode(node?: NodeUI): void {
        this.state = { ...this.state, gridSelection: { ...this.state.gridSelection, selectedNode: node } };
    }

    setSelectedEdge(edge?: EdgeUI): void {
        this.state = { ...this.state, gridSelection: { ...this.state.gridSelection, selectedEdge: edge } };
    }

    setSelectedGenerator(generator?: GeneratorUI): void {
        this.state = { ...this.state, gridSelection: { ...this.state.gridSelection, selectedGenerator: generator } };
    }
}