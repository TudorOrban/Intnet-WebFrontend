import { UIItem } from "../../../shared/common/types/Navigation";
import { NodeUI } from "./Bus";
import { EdgeUI } from "./Edge";
import { GeneratorUI } from "./Generator";

export interface GridComponentState {
    gridData: GridData;
    gridModes: GridModes;
    gridSelection: GridSelection;
}

export interface GridData {
    nodes: NodeUI[];
    edges: EdgeUI[];
}

export interface GridModes {
    // isAddModeOn: boolean;
    addMode: AddMode;
    isEditModeOn: boolean;
    isDeleteModeOn: boolean;
}

export interface AddMode {
    isAddModeOn: boolean;
    addOptions: UIItem[];
    selectedAddOption?: string;
}

export interface GridSelection {
    selectedNode?: NodeUI;
    selectedEdge?: EdgeUI;
    selectedGenerator?: GeneratorUI;
}