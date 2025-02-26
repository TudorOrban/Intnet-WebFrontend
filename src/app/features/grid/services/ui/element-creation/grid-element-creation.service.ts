import { Injectable } from "@angular/core";
import { BusCreatorService } from "./bus-creator.service";
import { EdgeCreatorService } from "./edge-creator.service";
import { GeneratorCreatorService } from "./generator-creator.service";
import { BusSearchDto, CreateBusDto } from "../../../models/Bus";
import { CreateEdgeDto, EdgeSearchDto } from "../../../models/Edge";
import { UIItem } from "../../../../../shared/common/types/Navigation";
import { CreateGeneratorDto, GeneratorSearchDto } from "../../../models/Generator";

@Injectable({
    providedIn: "root"
})
export class GridElementCreationService {
    private gridId?: number;

    constructor(
        private readonly busCreatorService: BusCreatorService,
        private readonly edgeCreatorService: EdgeCreatorService,
        private readonly generatorCreatorService: GeneratorCreatorService,
    ) {}

    getGridId(): number | undefined { return this.gridId; }
    getCreateBusDto(): CreateBusDto { return this.busCreatorService.createDto; }
    getIsCreateBusReady(): boolean { return this.busCreatorService.isReady; }
    getCreateEdgeDto(): CreateEdgeDto { return this.edgeCreatorService.createDto; }
    getIsCreateEdgeReady(): boolean { return this.edgeCreatorService.isReady; }
    getEdgeTypeOptions(): UIItem[] { return this.edgeCreatorService.options; }
    getCreateGeneratorDto(): CreateGeneratorDto { return this.generatorCreatorService.createDto; }
    getIsCreateGeneratorReady(): boolean { return this.generatorCreatorService.isReady; }
    getGeneratorTypeOptions(): UIItem[] { return this.generatorCreatorService.options; }

    getIsSomeElementReady(): boolean {
        return this.busCreatorService.isReady || this.edgeCreatorService.isReady || this.generatorCreatorService.isReady;
    }

    setGridId(gridId: number | undefined): void {
        this.gridId = gridId;
        this.busCreatorService.setGridId(gridId);
        this.edgeCreatorService.setGridId(gridId);
        this.generatorCreatorService.setGridId(gridId);
    }

    // Bus
    handleTempBusAdded(tempBus: BusSearchDto): void {
        this.busCreatorService.handleTempElementAdded(tempBus);
    }

    handleConfirmAddBus(): void {
        this.busCreatorService.handleConfirmAddElement();
    }

    handleCancelAddBus(): void {
        this.busCreatorService.handleCancelAddElement();
    }

    // Edge
    handleTempEdgeAdded(tempEdge: EdgeSearchDto): void {
        this.edgeCreatorService.handleTempElementAdded(tempEdge);
    }

    handleConfirmAddEdge(): void {
        this.edgeCreatorService.handleConfirmAddElement();
    }

    handleCancelAddEdge(): void {
        this.edgeCreatorService.handleCancelAddElement();
    }

    handleEdgeTypeSelected(value: string): void {
        this.edgeCreatorService.handleEdgeTypeSelected(value);
    }

    // Generator
    handleTempGeneratorAdded(tempGenerator: GeneratorSearchDto): void {
        this.generatorCreatorService.handleTempElementAdded(tempGenerator);
    }

    handleConfirmAddGenerator(): void {
        this.generatorCreatorService.handleConfirmAddElement();
    }

    handleCancelAddGenerator(): void {
        this.generatorCreatorService.handleCancelAddElement();
    }

    handleGeneratorTypeSelected(value: string): void {
        this.generatorCreatorService.handleGeneratorTypeSelected(value);
    }
}