import { Injectable } from "@angular/core";
import { GridElementCreator } from "./element-creator";
import { CreateGeneratorDto, GeneratorType, GeneratorUI } from "../../../models/Generator";
import { GeneratorService } from "../../api/generator.service";
import { GridMapCommunicatorService } from "../grid-interaction.service";
import { UIItem } from "../../../../../shared/common/types/Navigation";
import { GridStateService } from "../grid-state.service";

@Injectable({
    providedIn: "root"
})
export class GeneratorCreatorService implements GridElementCreator<CreateGeneratorDto, GeneratorUI> {
    createDto: CreateGeneratorDto = { gridId: 0, busId: 0 };
    isReady: boolean = false;
    options: UIItem[] = [
        { label: "Nuclear Station", value: "NUCLEAR" },
        { label: "Coal Station", value: "COAL" },
        { label: "Gas Station", value: "GAS" },
    ]

    constructor(
        private readonly generatorService: GeneratorService,
        private readonly gridStateService: GridStateService,
        private readonly gridMapCommunicatorService: GridMapCommunicatorService
    ) {}

    setGridId(gridId?: number): void {
        if (!gridId) return;
        this.createDto.gridId = gridId;
    }

    handleTempElementAdded(tempGenerator: GeneratorUI): void {
        if (!this.createDto.gridId || !tempGenerator.busId) return;
        
        this.createDto.busId = tempGenerator.busId;
        this.createDto.generatorName = tempGenerator.generatorName;

        this.isReady = true;
    }

    handleConfirmAddElement(): void {
        this.generatorService.createGenerator(this.createDto).subscribe(
            (data) => {
                this.gridStateService.selectAddOption(undefined);
                this.isReady = false;
                this.gridMapCommunicatorService.successGeneratorCreation(data);
            },
            (error) => {
                console.error("Error creating generator:", error);
            }
        );
    }

    handleCancelAddElement(): void {
        this.gridStateService.selectAddOption(undefined);
        this.isReady = false;
        this.gridMapCommunicatorService.cancelGeneratorCreation();
    }

    handleGeneratorTypeSelected(value: string): void {
        const generatorType = GeneratorType[value as keyof typeof GeneratorType];
        this.createDto.generatorType = generatorType;
    }
}