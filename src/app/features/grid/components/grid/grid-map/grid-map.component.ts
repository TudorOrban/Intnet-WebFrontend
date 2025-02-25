import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { NodeUI } from '../../../models/Bus';
import { EdgeUI } from '../../../models/Edge';
import { GridMapCommunicatorService } from '../../../services/ui/grid-interaction.service';
import { Subscription } from 'rxjs';
import { GridRendererService } from '../../../services/ui/grid-renderer.service';
import { GridEditorService } from '../../../services/ui/grid-editor.service';
import { GridStateService } from '../../../services/ui/grid-state.service';

@Component({
  selector: 'app-grid-map',
  imports: [CommonModule],
  templateUrl: './grid-map.component.html',
  styleUrl: './grid-map.component.css'
})
export class GridMapComponent implements OnInit, OnChanges, OnDestroy {
    @Input() nodes?: NodeUI[];
    @Input() edges?: EdgeUI[];
    @Input() selectedAddOption?: string;
    @Output() onTempNodeAdded = new EventEmitter<NodeUI>();
    @Output() onTempEdgeAdded = new EventEmitter<EdgeUI>();

    private successNodeSubscription: Subscription | undefined;
    private cancelNodeSubscription: Subscription | undefined;
    private successEdgeSubscription: Subscription | undefined;
    private cancelEdgeSubscription: Subscription | undefined;

    isGraphRendered: boolean = false;

    constructor(
        private readonly gridStateService: GridStateService,
        private readonly gridRendererService: GridRendererService,
        private readonly gridEditorService: GridEditorService,
        private readonly gridInteractionService: GridMapCommunicatorService,
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

    ngOnDestroy(): void {
        this.successNodeSubscription?.unsubscribe();
        this.cancelNodeSubscription?.unsubscribe();
        this.successEdgeSubscription?.unsubscribe();
        this.cancelEdgeSubscription?.unsubscribe();
    }

    private subscribeToEvents(): void {
        this.subscribeToParentEvents();
        this.subscribeToEditorEvents();
    }

    private subscribeToParentEvents(): void {
        this.successNodeSubscription = this.gridInteractionService.successNodeCreation$.subscribe((createdNode) => {
            this.gridEditorService.makeTempNodePermanent(createdNode);
        });
        this.cancelNodeSubscription = this.gridInteractionService.cancelNodeCreation$.subscribe(() => {
            this.gridEditorService.clearTempNode();
        });
        this.successEdgeSubscription = this.gridInteractionService.successEdgeCreation$.subscribe((createdEdge) => {
            this.gridEditorService.makeTempEdgePermanent(createdEdge);
        });
        this.cancelEdgeSubscription = this.gridInteractionService.cancelEdgeCreation$.subscribe(() => {
            this.gridEditorService.clearTempEdge(true);
        });
    }

    private subscribeToEditorEvents(): void {
        this.gridEditorService.onTempNodeAdded.subscribe((tempNode) => {
            this.onTempNodeAdded.emit(tempNode);
        });
        this.gridEditorService.onTempEdgeAdded.subscribe((tempEdge) => {
            this.onTempEdgeAdded.emit(tempEdge);
        });
    }

    private renderGridGraph(): void {
        if (!this.nodes || !this.edges || this.isGraphRendered) return;
        
        this.gridRendererService.renderGraph();
    }
}
