import { EventEmitter, Injectable } from "@angular/core";
import { LeafletMouseEvent } from "leaflet";
import { NodeUI } from "../../models/Bus";
import { EdgeType, EdgeUI } from "../../models/Edge";
import { GridRendererService } from "./grid-renderer.service";
import { GridStateService } from "./grid-state.service";
import { GridEventService } from "./grid-event.service";
import { Subscription } from "rxjs";
import { GridMapCommunicatorService } from "./grid-interaction.service";

@Injectable({
    providedIn: "root"
})
export class GridEditorService {
    private selectedAddOption?: string;
    private tempNodeMarker?: L.Marker;
    private tempNode?: NodeUI;
    private tempEdgePolyline?: L.Polyline;
    private tempEdge: EdgeUI = { id: -1, gridId: -1, srcBusId: -1, destBusId: -1, edgeType: EdgeType.TRANSMISSION };
    private tempSrcNodeId?: number;
    private tempDestNodeId?: number;

    private successNodeSubscription: Subscription | undefined;
    private cancelNodeSubscription: Subscription | undefined;
    private successEdgeSubscription: Subscription | undefined;
    private cancelEdgeSubscription: Subscription | undefined;

    onTempNodeAdded = new EventEmitter<NodeUI>();
    onTempEdgeAdded = new EventEmitter<EdgeUI>();

    constructor(
        private readonly gridStateService: GridStateService,
        private readonly gridEventService: GridEventService,
        private readonly gridRendererService: GridRendererService,
        private readonly gridCommunicatorService: GridMapCommunicatorService
    ) {
        this.gridEventService.mapClicked$.subscribe((e) => {
            this.handleMapClick(e);
        })
        this.gridEventService.nodeClicked$.subscribe((clickedNode) => {
            this.handleAddEdgeNodeClick(clickedNode);
        });
        this.subscribeToParentEvents();
    }

    private subscribeToParentEvents(): void {
        this.successNodeSubscription = this.gridCommunicatorService.successNodeCreation$.subscribe((createdNode) => {
            this.makeTempNodePermanent(createdNode);
        });
        this.cancelNodeSubscription = this.gridCommunicatorService.cancelNodeCreation$.subscribe(() => {
            this.clearTempNode();
        });
        this.successEdgeSubscription = this.gridCommunicatorService.successEdgeCreation$.subscribe((createdEdge) => {
            this.makeTempEdgePermanent(createdEdge);
        });
        this.cancelEdgeSubscription = this.gridCommunicatorService.cancelEdgeCreation$.subscribe(() => {
            this.clearTempEdge(true);
        });
    }

    setSelectedAddOption(option?: string): void {
        this.selectedAddOption = option;
    }
    
    handleMapClick(e: LeafletMouseEvent): void {
        const clickedLat = e.latlng.lat;
        const clickedLng = e.latlng.lng;
        console.log(`Latitude: ${clickedLat}, Longitude: ${clickedLng}`);

        switch (this.selectedAddOption) {
            case "bus":
                this.handleAddNodeMapClick(clickedLat, clickedLng);
                break;
        }
    }

    private handleAddNodeMapClick(clickedLat: number, clickedLng: number,): void {
        this.gridRendererService.removeNodeFromMap(this.tempNodeMarker);

        this.tempNode = { id: 0, gridId: 0, latitude: clickedLat, longitude: clickedLng, isTemporary: true }
        this.tempNodeMarker = this.gridRendererService.buildNodeMarker(this.tempNode);
        this.gridRendererService.addNodeToMap(this.tempNodeMarker);

        this.onTempNodeAdded.emit(this.tempNode);
    }

    handleAddEdgeNodeClick(clickedNode: NodeUI): void {
        if (this.selectedAddOption !== "edge") {
            return;
        }

        if (!this.tempSrcNodeId) {
            this.handleSrcNodeClick(clickedNode);
            return;
        }
        
        if (this.tempDestNodeId) {
            this.clearTempEdge(false);
        }

        this.handleDestNodeClick(clickedNode);
    }

    private handleSrcNodeClick(clickedNode: NodeUI) {
        this.tempSrcNodeId = clickedNode.id;
        this.tempEdge.srcBusId = clickedNode.id;

        const nodes = this.gridStateService.nodes;
        nodes?.forEach((node) => {
            if (node.id === clickedNode.id) {
                node.isSelected = true;
                return;
            }
        });
    }

    private handleDestNodeClick(bus: NodeUI) {
        if (bus.id === this.tempSrcNodeId) {
            return;
        }
        this.tempDestNodeId = bus.id;
        this.tempEdge.destBusId = bus.id;

        const nodes = this.gridStateService.nodes;
        nodes?.forEach((node) => {
            if (node.id !== bus.id) {
                return;
            }

            node.isSelected = true;
            const determined = this.gridRendererService.determineNodeLatLong(this.tempEdge);
            if (!determined) {
                return;
            }

            this.tempEdgePolyline = this.gridRendererService.buildEdgePolyline(this.tempEdge);
            this.gridRendererService.addEdgeToMap(this.tempEdgePolyline);

            this.onTempEdgeAdded.emit(this.tempEdge);

            return;
        });
    }

    makeTempNodePermanent(createdNode: NodeUI): void {
        this.clearTempNode();
        this.gridStateService.addNode(createdNode);

        const createdNodeMarker = this.gridRendererService.buildNodeMarker(createdNode);
        this.gridRendererService.addNodeToMap(createdNodeMarker);
    }

    clearTempNode(): void {
        this.gridRendererService.removeNodeFromMap(this.tempNodeMarker);
    }

    makeTempEdgePermanent(createdEdge: EdgeUI): void {
        this.clearTempEdge(true);

        const determined = this.gridRendererService.determineNodeLatLong(createdEdge);
        if (!determined) return;

        this.gridStateService.addEdge(createdEdge);

        const createdEdgePolyline = this.gridRendererService.buildEdgePolyline(createdEdge);
        this.gridRendererService.addEdgeToMap(createdEdgePolyline);
    }

    clearTempEdge(clearSrcNode?: boolean): void {
        this.gridRendererService.removeEdgeFromMap(this.tempEdgePolyline);

        // Clear selection of old dest node
        const nodes = this.gridStateService.nodes;
        nodes?.forEach((node) => {
            if (node.id === this.tempSrcNodeId && clearSrcNode) {
                node.isSelected = false;
                this.tempSrcNodeId = undefined;
            }
            if (node.id === this.tempDestNodeId) {
                node.isSelected = false;
                this.tempDestNodeId = undefined;
            }
        });
    }

    getTempNodeMarker(): L.Marker | undefined {
        return this.tempNodeMarker;
    }
}