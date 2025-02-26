import { Injectable } from "@angular/core";
import { GridStateService } from "../grid-state.service";
import { GridEventService } from "../grid-event.service";
import { NodeUI } from "../../../models/Bus";
import { GeneratorUI } from "../../../models/Generator";

@Injectable({
    providedIn: "root"
})
export class GridElementSelectionService {

    constructor(
        private readonly gridStateService: GridStateService,
        private readonly gridEventService: GridEventService,
    ) {
        this.gridEventService.nodeClicked$.subscribe((clickedNode) => {
            this.selectClickedNode(clickedNode);
        });
        this.gridEventService.generatorClicked$.subscribe((clickedGenerator) => {
            this.selectClickedGenerator(clickedGenerator);
        });
    }

    private selectClickedNode(clickedNode: NodeUI): void {
        this.gridStateService.setSelectedNode(clickedNode);
    }

    private selectClickedGenerator(clickedGenerator: GeneratorUI): void {
        const nodes = this.gridStateService.nodes;
        nodes.forEach(node => { // TODO: Find more efficient method to unselect
            node.generators?.forEach(gen => {
                gen.isSelected = gen.id === clickedGenerator.id;
            })
        });

        this.gridStateService.setSelectedGenerator(clickedGenerator);
    }
    
}