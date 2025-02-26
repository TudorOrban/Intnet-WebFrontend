export interface GeneratorSearchDto {
    id: number;
    gridId: number;
    generatorName?: string;
    generatorType?: GeneratorType;
    createdAt: Date;
    updatedAt: Date;
    generatorVoltageSetpoint?: number;
    generatorMaxActivePower?: number;
    generatorMinActivePower?: number;
    generatorMaxReactivePower?: number;
    generatorMinReactivePower?: number;

    state?: GeneratorStateDto;
}

export enum GeneratorType {
    NUCLEAR,
    COAL,
    GAS
}

export interface CreateGeneratorDto {
    gridId: number;
    generatorName?: string;
    generatorVoltageSetpoint?: number;
    generatorMaxActivePower?: number;
    generatorMinActivePower?: number;
    generatorMaxReactivePower?: number;
    generatorMinReactivePower?: number;
}

export interface UpdateGeneratorDto {
    id: number;
    gridId: number;
    generatorName?: string;
    generatorVoltageSetpoint?: number;
    generatorMaxActivePower?: number;
    generatorMinActivePower?: number;
    generatorMaxReactivePower?: number;
    generatorMinReactivePower?: number;
}

export interface GeneratorStateDto {
    id: number;
    gridId: number;
    updatedAt: Date;
    activePowerGeneration?: number;
    reactivePowerGeneration?: number;
    generatorVoltageSetpoint?: number;
}

// UI
export interface GeneratorUI extends GeneratorSearchDto {
    x?: number;
    y?: number;
    isSelected?: boolean;
}