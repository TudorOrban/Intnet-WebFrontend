import { CommonModule } from '@angular/common';
import { Component, EmbeddedViewRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { NodeUI } from '../../../models/Bus';
import { NodeComponent } from './node/node.component';
import { EdgeType, EdgeUI } from '../../../models/Edge';
import { LeafletMouseEvent } from 'leaflet';
import { GridInteractionService } from '../../../services/ui/grid-interaction.service';
import { Subscription } from 'rxjs';
import { GridRendererService } from '../../../services/ui/grid-renderer.service';
// import { GridRendererService } from '../../../services/ui/grid-renderer.service';

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
    @Input() cancelCreateBusFlag: boolean = false; 
    @Input() cancelCreateEdgeFlag: boolean = false;
    @Output() onTempNodeAdded = new EventEmitter<NodeUI>();
    @Output() onTempEdgeAdded = new EventEmitter<EdgeUI>();

    private map: any;
    private L: any;

    private tempNodeMarker?: L.Marker;
    private tempNode?: NodeUI;
    private tempEdgePolyline?: L.Polyline;
    private tempEdge: EdgeUI = { id: -1, gridId: -1, srcBusId: -1, destBusId: -1, edgeType: EdgeType.DISTRIBUTION };
    private tempSrcNodeId?: number;
    private tempDestNodeId?: number;
    private cancelNodeSubscription: Subscription | undefined;
    private cancelEdgeSubscription: Subscription | undefined;

    areNodesRendered: boolean = false;
    areEdgesRendered: boolean = false;

    constructor(
        private gridRendererService: GridRendererService,
        private gridInteractionService: GridInteractionService,
        private viewContainerRef: ViewContainerRef,
    ) {}

    async ngOnInit(): Promise<void> {
        await this.gridRendererService.initMap("map", this.viewContainerRef, this.handleMapClick.bind(this));
        this.subscribeToParentEvents();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.renderNodesAndEdges(changes);
    }

    ngOnDestroy(): void {
        this.cancelNodeSubscription?.unsubscribe();
        this.cancelEdgeSubscription?.unsubscribe();
    }

    private subscribeToParentEvents(): void {
        this.cancelNodeSubscription = this.gridInteractionService.cancelNodeCreation$.subscribe(() => {
            this.gridRendererService.removeNodeFromMap(this.tempNodeMarker);
        });
        this.cancelEdgeSubscription = this.gridInteractionService.cancelEdgeCreation$.subscribe(() => {
            this.clearTempEdge(true);
        });
    }

    private renderNodesAndEdges(changes: SimpleChanges): void {
        // Account for potential timing issues, as renderEdges depends on nodes
        if (changes["nodes"]?.currentValue) {
            if (!this.areNodesRendered) {
                this.nodes = changes["nodes"]?.currentValue;
                this.gridRendererService.renderNodes(this.nodes, this.handleNodeClick.bind(this));
                this.areNodesRendered = true;
            }

            if (this.edges && !this.areEdgesRendered) {
                this.gridRendererService.renderEdges(this.edges, this.nodes);
                this.areEdgesRendered = true;
            }
        }
        if (changes["edges"]?.currentValue && !this.areEdgesRendered) {
            this.edges = changes["edges"]?.currentValue;

            this.gridRendererService.renderEdges(this.edges, this.nodes);
            this.areEdgesRendered = true;
        }
    }

    private addNodeMarker(node: NodeUI): L.Marker {
        const componentRef = this.viewContainerRef.createComponent(NodeComponent);
        componentRef.instance.node = node;
        componentRef.instance.nodeClicked.subscribe((clickedNode: NodeUI) => {
            this.handleNodeClick(clickedNode);
        });

        const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        const marker = this.L.marker([node.latitude, node.longitude], {
            icon: this.L.divIcon({
                html: domElement,
                class: "flex items-center justify-center w-5 h-5",
                className: "div-icon-custom",
                iconSize: [16, 16]
            }),
        });

        return marker;
    }

    // Add Node logic
    private handleMapClick(e: LeafletMouseEvent): void {
        const clickedLat = e.latlng.lat;
        const clickedLng = e.latlng.lng;
        console.log(`Latitude: ${clickedLat}, Longitude: ${clickedLng}`);

        switch (this.selectedAddOption) {
            case "bus":
                this.handleAddNodeMapClick(clickedLat, clickedLng);
                break;
        }
    }

    private handleAddNodeMapClick(clickedLat: number, clickedLng: number): void {
        this.gridRendererService.removeNodeFromMap(this.tempNodeMarker);

        this.tempNode = { id: 0, gridId: 0, latitude: clickedLat, longitude: clickedLng }
        this.tempNodeMarker = this.gridRendererService.addNodeMarker(this.tempNode, this.handleNodeClick.bind(this));
        this.gridRendererService.addNodeToMap(this.tempNodeMarker);

        this.onTempNodeAdded.emit(this.tempNode);
    }

    // Add Edge logic
    handleNodeClick(bus: NodeUI): void {
        if (this.selectedAddOption !== "edge") {
            return;
        }

        if (!this.tempSrcNodeId) {
            this.handleSrcNodeClick(bus);
            return;
        }
        
        if (this.tempDestNodeId) {
            this.clearTempEdge();
        }

        this.handleDestNodeClick(bus);
    }

    handleSrcNodeClick(bus: NodeUI) {
        this.tempSrcNodeId = bus.id;
        this.tempEdge.srcBusId = bus.id;

        this.nodes?.forEach((node) => {
            if (node.id === bus.id) {
                node.isSelected = true;
                return;
            }
        });
    }

    handleDestNodeClick(bus: NodeUI) {
        this.tempDestNodeId = bus.id;
        this.tempEdge.destBusId = bus.id;

        this.nodes?.forEach((node) => {
            if (node.id !== bus.id) {
                return;
            }

            node.isSelected = true;
            const determined = this.gridRendererService.determineNodeLatLong(this.tempEdge, this.nodes);
            if (!determined) {
                return;
            }

            this.tempEdgePolyline = this.gridRendererService.addEdgePolyline(this.tempEdge);
            this.tempEdgePolyline.addTo(this.map);

            this.onTempEdgeAdded.emit(this.tempEdge);

            return;
        });
    }

    clearTempEdge(clearSrcNode?: boolean): void {
        console.log("clear", clearSrcNode);
        if (this.tempEdgePolyline) {
            this.map.removeLayer(this.tempEdgePolyline);
            this.tempEdgePolyline = undefined;
        }

        // Clear selection of old dest node
        this.nodes?.forEach((node) => {
            if (node.id === this.tempSrcNodeId && clearSrcNode) {
                console.log("Src", clearSrcNode);
                node.isSelected = false;
                this.tempSrcNodeId = undefined;
            }
            if (node.id === this.tempDestNodeId) {
                node.isSelected = false;
                this.tempDestNodeId = undefined;
            }
        });
    }
}
