import { Injectable } from "@angular/core";
import { GridStateService } from "../grid-state.service";
import { GridEventService } from "../grid-event.service";
import { NodeUI } from "../../../models/Bus";

@Injectable({
    providedIn: "root"
})
export class GridDetailsService {

    constructor(
        private readonly gridStateService: GridStateService,
        private readonly gridEventService: GridEventService,
    ) {
        this.gridEventService.nodeClicked$.subscribe((clickedNode) => {
            this.viewNodeDetails(clickedNode);
        });
    }

    private viewNodeDetails(node: NodeUI): void {
        this.gridStateService.setSelectedNode(node);
    }
    
}