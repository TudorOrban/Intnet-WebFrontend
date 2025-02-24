export interface EdgeSearchDto {
    id: number;
    gridId: number;
    edgeName?: String;
    createdAt?: Date;
    updatedAt?: Date;
    srcBusId: number;
    destBusId: number;
    edgeType: EdgeType;
    lineLength?: number;
    resistance?: number;
    reactance?: number;
    conductance?: number;
    susceptance?: number;
    thermalRating?: number;
    voltageLimitsMin?: number;
    voltageLimitsMax?: number;
}

export interface CreateEdgeDto {
    gridId: number;
    edgeName?: String;
    srcBusId: number;
    destBusId: number;
    edgeType: EdgeType;
    lineLength?: number;
    resistance?: number;
    reactance?: number;
    conductance?: number;
    susceptance?: number;
    thermalRating?: number;
    voltageLimitsMin?: number;
    voltageLimitsMax?: number;
}

export interface UpdateEdgeDto {
    id: number;
    gridId: number;
    edgeName?: String;
    srcBusId: number;
    destBusId: number;
    edgeType: EdgeType;
    lineLength?: number;
    resistance?: number;
    reactance?: number;
    conductance?: number;
    susceptance?: number;
    thermalRating?: number;
    voltageLimitsMin?: number;
    voltageLimitsMax?: number;
}

export enum EdgeType {
    TRANSMISSION = "TRANSMISSION",
    DISTRIBUTION = "DISTRIBUTION",
    TRANSFORMER = "TRANSFORMER"
}

// UI
export interface EdgeUI extends EdgeSearchDto {
    srcNodeLatLong?: number[];
    destNodeLatLong?: number[];
}

export interface TempEdgeUI {
    gridId: number;
    edgeName?: String;
    createdAt?: Date;
    updatedAt?: Date;
    srcBusId?: number;
    destBusId?: number;
    edgeType?: EdgeType;
}