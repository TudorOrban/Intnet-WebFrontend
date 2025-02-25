import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { NodeUI } from '../../../models/Bus';
import { EdgeUI } from '../../../models/Edge';
import { GridRendererService } from '../../../services/ui/grid-renderer.service';
import { GridEditorService } from '../../../services/ui/grid-editor.service';
import { GridStateService } from '../../../services/ui/grid-state.service';
import { GridElementCreationService } from '../../../services/ui/map-wrapper/grid-element-creation.service';

@Component({
  selector: 'app-grid-map',
  imports: [CommonModule],
  templateUrl: './grid-map.component.html',
  styleUrl: './grid-map.component.css'
})
export class GridMapComponent implements OnInit, OnChanges {
    @Input() nodes?: NodeUI[];
    @Input() edges?: EdgeUI[];
    @Input() selectedAddOption?: string;

    isGraphRendered: boolean = false;

    constructor(
        private readonly gridStateService: GridStateService,
        private readonly gridRendererService: GridRendererService,
        private readonly gridEditorService: GridEditorService,
        private readonly elementCreationService: GridElementCreationService,
        private readonly viewContainerRef: ViewContainerRef
    ) {}

    async ngOnInit(): Promise<void> {
        await this.gridRendererService.initMap("map", this.viewContainerRef);

        this.subscribeToEvents();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["nodes"]?.currentValue) {
            this.gridStateService.setNodes(changes["nodes"].currentValue);
            this.renderGridGraph();
        }
        if (changes["edges"]?.currentValue) {
            this.gridStateService.setEdges(changes["edges"].currentValue);
            this.renderGridGraph();
        }
        if (changes["selectedAddOption"] && changes["selectedAddOption"].currentValue !== changes["selectedAddOption"].previousValue) {
            this.gridEditorService.setSelectedAddOption(changes["selectedAddOption"].currentValue);
        }
    }

    private renderGridGraph(): void {
        if (!this.nodes || !this.edges || this.isGraphRendered) return;
        
        this.gridRendererService.renderGraph();
    }


    private subscribeToEvents(): void {
        this.gridEditorService.onTempNodeAdded.subscribe((tempNode) => {
            this.elementCreationService.handleTempNodeAdded(tempNode);
        });
        this.gridEditorService.onTempEdgeAdded.subscribe((tempEdge) => {
            this.elementCreationService.handleTempEdgeAdded(tempEdge);
        });
    }
}
