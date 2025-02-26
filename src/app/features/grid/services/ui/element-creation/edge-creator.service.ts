import { Injectable } from "@angular/core";
import { GridElementCreator } from "./element-creator";
import { CreateEdgeDto, EdgeType, EdgeUI } from "../../../models/Edge";
import { EdgeService } from "../../api/edge.service";
import { GridMapCommunicatorService } from "../grid-interaction.service";
import { UIItem } from "../../../../../shared/common/types/Navigation";
import { GridStateService } from "../grid-state.service";

@Injectable({
    providedIn: "root"
})
export class EdgeCreatorService implements GridElementCreator<CreateEdgeDto, EdgeUI> {
    createDto: CreateEdgeDto = { gridId: 0, srcBusId: 0, destBusId: 0, edgeType: EdgeType.TRANSMISSION };
    isReady: boolean = false;
    options: UIItem[] = [
        { label: "Transmission Line", value: "TRANSMISSION" },
        { label: "Distribution Line", value: "DISTRIBUTION" },
        { label: "Transformer", value: "TRANSFORMER" },
    ];

    constructor(
        private readonly edgeService: EdgeService,
        private readonly gridStateService: GridStateService,
        private readonly gridMapCommunicatorService: GridMapCommunicatorService
    ) {}

    setGridId(gridId?: number): void {
        if (!gridId) return;
        this.createDto.gridId = gridId;
    }

    handleTempElementAdded(tempEdge: EdgeUI): void {
        if (!this.createDto.gridId) return;
        
        this.createDto.srcBusId = tempEdge.srcBusId ?? 0;
        this.createDto.destBusId = tempEdge.destBusId ?? 0;

        this.isReady = true;
    }

    handleConfirmAddElement(): void {
        this.edgeService.createEdge(this.createDto).subscribe(
            (data) => {
                this.gridStateService.selectAddOption(undefined);
                this.isReady = false;
                this.gridMapCommunicatorService.successEdgeCreation(data);
            },
            (error) => {
                console.error("Error creating edge:", error);
            }
        );
    }

    handleCancelAddElement(): void {
        this.gridStateService.selectAddOption(undefined);
        this.isReady = false;
        this.gridMapCommunicatorService.cancelEdgeCreation();
    }

    handleEdgeTypeSelected(value: string): void {
        const edgeType = EdgeType[value as keyof typeof EdgeType];
        this.createDto.edgeType = edgeType;
    }
}