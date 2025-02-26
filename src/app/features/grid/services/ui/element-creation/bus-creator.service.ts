import { Injectable } from "@angular/core";
import { GridElementCreator } from "./element-creator";
import { CreateBusDto, NodeUI } from "../../../models/Bus";
import { BusService } from "../../api/bus.service";
import { GridMapCommunicatorService } from "../grid-interaction.service";
import { GridStateService } from "../grid-state.service";

@Injectable({
    providedIn: "root"
})
export class BusCreatorService implements GridElementCreator<CreateBusDto, NodeUI> {
    createDto: CreateBusDto = { gridId: 0, latitude: 0, longitude: 0 };
    isReady: boolean = false;

    constructor(
        private readonly busService: BusService,
        private readonly gridStateService: GridStateService,
        private readonly gridMapCommunicatorService: GridMapCommunicatorService
    ) {}

    setGridId(gridId?: number): void {
        if (!gridId) return;
        this.createDto.gridId = gridId;
    }

    handleTempElementAdded(tempNode: NodeUI): void {
        if (!this.createDto.gridId) return;

        this.createDto.latitude = tempNode.latitude;
        this.createDto.longitude = tempNode.longitude;
        console.log("Adding", tempNode);
        this.isReady = true;
    }

    handleConfirmAddElement(): void {
        this.busService.createBus(this.createDto).subscribe(
            (data) => {
                this.gridStateService.selectAddOption(undefined);
                this.isReady = false;
                this.gridMapCommunicatorService.successNodeCreation(data);
            },
            (error) => {
                console.error("Error creating bus:", error);
            }
        );
    }

    handleCancelAddElement(): void {
        this.gridStateService.selectAddOption(undefined);
        this.isReady = false;
        this.gridMapCommunicatorService.cancelNodeCreation();
    }
}