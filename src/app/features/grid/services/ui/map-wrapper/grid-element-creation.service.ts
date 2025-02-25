import { Injectable } from "@angular/core";
import { UIItem } from "../../../../../shared/common/types/Navigation";
import { gridAddOptions } from "../../../config/gridAddOptions";
import { BusSearchDto, CreateBusDto } from "../../../models/Bus";
import { CreateEdgeDto, EdgeType } from "../../../models/Edge";
import { BusService } from "../../api/bus.service";
import { EdgeService } from "../../api/edge.service";
import { GridMapCommunicatorService } from "../grid-interaction.service";

@Injectable({
    providedIn: "root"
})
export class GridElementCreationService {

    private gridId?: number;
    private selectedAddOption?: string;
    private createBusDto: CreateBusDto = { gridId: -1, latitude: 0, longitude: 0 };
    private isCreateBusReady: boolean = false;
    private createEdgeDto: CreateEdgeDto = { gridId: -1, srcBusId: -1, destBusId: -1, edgeType: EdgeType.TRANSMISSION };
    private isCreateEdgeReady: boolean = false;
    private edgeTypeOptions: UIItem[] = [
        { label: "Transmission Line", value: "TRANSMISSION" },
        { label: "Distribution Line", value: "DISTRIBUTION" },
        { label: "Transformer", value: "TRANSFORMER" },
    ];

    constructor(
        private readonly busService: BusService,
        private readonly edgeService: EdgeService,
        private readonly gridMapCommunicatorService: GridMapCommunicatorService
    ) {}

    getGridId(): number | undefined { return this.gridId; }
    getSelectedAddOption(): string | undefined { return this.selectedAddOption; }
    getCreateBusDto(): CreateBusDto { return this.createBusDto; }
    getIsCreateBusReady(): boolean { return this.isCreateBusReady; }
    getCreateEdgeDto(): CreateEdgeDto { return this.createEdgeDto; }
    getIsCreateEdgeReady(): boolean { return this.isCreateEdgeReady; }
    getEdgeTypeOptions(): UIItem[] { return this.edgeTypeOptions; }

    setGridId(gridId: number | undefined): void {
        this.gridId = gridId;
    }

    selectAddOption(optionValue: string): void {
        this.selectedAddOption = optionValue;
    }

    // Node
    handleTempNodeAdded(tempNode: BusSearchDto): void {
        if (!this.gridId) {
            console.error("No Grid selected");
            return;
        }

        this.createBusDto.gridId = this.gridId;
        this.createBusDto.latitude = tempNode.latitude;
        this.createBusDto.longitude = tempNode.longitude;

        this.isCreateBusReady = true;
    }

    handleConfirmAddNode(): void {
        this.busService.createBus(this.createBusDto).subscribe(
            (data) => {
                this.selectedAddOption = undefined;
                this.isCreateBusReady = false;
                this.gridMapCommunicatorService.successNodeCreation(data);
            },
            (error) => {
                console.error("Error creating bus:", error);
            }
        );
    }

    handleCancelAddNode(): void {
        this.selectedAddOption = undefined;
        this.isCreateBusReady = false;
        this.gridMapCommunicatorService.cancelNodeCreation();
    }

    // Edge
    handleTempEdgeAdded(tempEdge: { srcBusId?: number; destBusId?: number }): void {
        if (!this.gridId) {
            console.error("No Grid selected");
            return;
        }

        this.createEdgeDto.gridId = this.gridId;
        this.createEdgeDto.srcBusId = tempEdge.srcBusId ?? 0;
        this.createEdgeDto.destBusId = tempEdge.destBusId ?? 0;

        this.isCreateEdgeReady = true;
    }

    handleConfirmAddEdge(): void {
        this.edgeService.createEdge(this.createEdgeDto).subscribe(
            (data) => {
                this.selectedAddOption = undefined;
                this.isCreateEdgeReady = false;
                this.gridMapCommunicatorService.successEdgeCreation(data);
            },
            (error) => {
                console.error("Error creating edge:", error);
            }
        );
    }

    handleCancelAddEdge(): void {
        this.selectedAddOption = undefined;
        this.isCreateEdgeReady = false;
        this.gridMapCommunicatorService.cancelEdgeCreation();
    }

    handleEdgeTypeSelected(value: string): void {
        const edgeType = EdgeType[value as keyof typeof EdgeType];
        this.createEdgeDto.edgeType = edgeType;
    }
}