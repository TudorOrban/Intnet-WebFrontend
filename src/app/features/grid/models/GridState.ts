import { NodeUI } from "./Bus";
import { EdgeUI } from "./Edge";

export interface GridState {
    gridData: GridData;
    gridModes: GridModes;
    gridSelection: GridSelection;
}

export interface GridData {
    nodes: NodeUI[];
    edges: EdgeUI[];
}

export interface GridModes {
    isAddModeOn: boolean;
    isEditModeOn: boolean;
    isDeleteModeOn: boolean;
}

export interface GridSelection {
    selectedNode?: NodeUI;
    selectedEdge?: EdgeUI;
}