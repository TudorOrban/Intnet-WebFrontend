import { EdgeType } from "./Edge";

export interface GridStyles {
    nodeStyles: NodeStyles;
    edgeStyles: EdgeStyles;
}

interface NodeStyles {
    default: NodeTypeStyles;
    hovered?: NodeTypeStyles;
    selected?: NodeTypeStyles;
}

type NodeTypeStyles = Record<NodeType, NodeStyle>;

export enum NodeType {
    TRANSMISSION = "TRANSMISSION",
    DISTRIBUTION = "DISTRIBUTION"
}

export interface NodeStyle {
    color: string;
    size: number;
    border: string;
}

interface EdgeStyles {
    default: EdgeTypeStyles;
    hovered?: EdgeTypeStyles;
    selected?: EdgeTypeStyles;
}

type EdgeTypeStyles = Record<EdgeType, EdgeStyle>;

interface EdgeStyle {
    color: string;
    weight: number;
}