import { GeneratorSearchDto } from "./Generator";

export interface BusSearchDto {
    id: number;
    gridId: number;
    busName?: string;
    createdAt?: Date;
    updatedAt?: Date;
    latitude: number;
    longitude: number;

    state?: BusStateDto;

    generators?: GeneratorSearchDto[];
}

export interface CreateBusDto {
    gridId: number;
    busName?: string;
    latitude: number;
    longitude: number;
}

export interface UpdateBusDto {
    id: number;
    gridId: number;
    busName?: string;
    latitude: number;
    longitude: number;
}

export interface BusStateDto {
    id: number;
    gridId: number;
    busId: number;
    createdAt?: Date;
    updatedAt?: Date;
    voltageMagnitude?: number;
    voltageAngle?: number;
    activePowerInjection?: number;
    reactivePowerInjection?: number;
    shuntCapacitatorReactoStatus?: boolean;
    phaseShiftingTransformerTapPosition?: number;
}

// UI
export interface NodeUI extends BusSearchDto {
    isSelected?: boolean;
    isTemporary?: boolean;
    isDistributionNode?: boolean;
}
