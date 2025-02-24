import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { NodeUI } from '../../../models/Bus';
import { EdgeUI } from '../../../models/Edge';
import { GridMapCommunicatorService } from '../../../services/ui/grid-interaction.service';
import { Subscription } from 'rxjs';
import { GridRendererService } from '../../../services/ui/grid-renderer.service';
import { GridEditorService } from '../../../services/ui/grid-editor.service';

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

    areNodesRendered: boolean = false;
    areEdgesRendered: boolean = false;

    constructor(
        private gridRendererService: GridRendererService,
        private gridEditorService: GridEditorService,
        private gridInteractionService: GridMapCommunicatorService,
        private viewContainerRef: ViewContainerRef,
    ) {}

    async ngOnInit(): Promise<void> {
        await this.gridRendererService.initMap(
            "map", 
            this.viewContainerRef,
            this.gridEditorService.handleMapClick.bind(this.gridEditorService),
        );

        this.subscribeToEvents();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["nodes"]?.currentValue) {
            this.renderNodes();
        }
        if (changes["edges"]?.currentValue) {
            this.renderEdges();
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
        this.successNodeSubscription = this.gridInteractionService.successNodeCreation$.subscribe((createdNode) => {
            this.gridEditorService.makeTempNodePermanent(createdNode, this.nodes);
        });
        this.cancelNodeSubscription = this.gridInteractionService.cancelNodeCreation$.subscribe(() => {
            this.gridEditorService.clearTempNode();
        });
        this.successEdgeSubscription = this.gridInteractionService.successEdgeCreation$.subscribe((createdEdge) => {
            this.gridEditorService.makeTempEdgePermanent(createdEdge, this.nodes);
        });
        this.cancelEdgeSubscription = this.gridInteractionService.cancelEdgeCreation$.subscribe(() => {
            this.gridEditorService.clearTempEdge(true, this.nodes);
        });

        this.gridEditorService.onTempNodeAdded.subscribe((tempNode) => {
            this.onTempNodeAdded.emit(tempNode);
        });
        this.gridEditorService.onTempEdgeAdded.subscribe((tempEdge) => {
            this.onTempEdgeAdded.emit(tempEdge);
        });
    }

    private renderNodes(): void {
        if (!this.nodes || this.areNodesRendered) {
            return;
        }

        this.gridRendererService.renderNodes(
            this.nodes,
            (clickedNode: NodeUI) => 
                (this.gridEditorService.handleNodeClick.bind(this.gridEditorService))(clickedNode, this.nodes)
        );
        this.areNodesRendered = true;
    }

    private renderEdges(): void {
        if (!this.edges || !this.nodes) {
            return;
        }

        this.gridRendererService.renderEdges(this.edges, this.nodes);
        this.areEdgesRendered = true;
    }
}
