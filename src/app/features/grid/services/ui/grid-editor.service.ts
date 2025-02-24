import { EventEmitter, Injectable } from "@angular/core";
import { LeafletMouseEvent } from "leaflet";
import { NodeUI } from "../../models/Bus";
import { EdgeType, EdgeUI } from "../../models/Edge";
import { GridRendererService } from "./grid-renderer.service";

@Injectable({
    providedIn: "root"
})
export class GridEditorService {
    selectedAddOption?: string;
    private tempNodeMarker?: L.Marker;
    private tempNode?: NodeUI;
    private tempEdgePolyline?: L.Polyline;
    private tempEdge: EdgeUI = { id: -1, gridId: -1, srcBusId: -1, destBusId: -1, edgeType: EdgeType.DISTRIBUTION };
    private tempSrcNodeId?: number;
    private tempDestNodeId?: number;

    onTempNodeAdded = new EventEmitter<NodeUI>();
    onTempEdgeAdded = new EventEmitter<EdgeUI>();

    constructor(
        private gridRendererService: GridRendererService
    ) {}
    
    handleMapClick(
        e: LeafletMouseEvent
    ): void {
        const clickedLat = e.latlng.lat;
        const clickedLng = e.latlng.lng;
        console.log(`Latitude: ${clickedLat}, Longitude: ${clickedLng}`);

        switch (this.selectedAddOption) {
            case "bus":
                this.handleAddNodeMapClick(clickedLat, clickedLng);
                break;
        }
    }

    private handleAddNodeMapClick(
        clickedLat: number, 
        clickedLng: number,
    ): void {
        this.gridRendererService.removeNodeFromMap(this.tempNodeMarker);

        this.tempNode = { id: 0, gridId: 0, latitude: clickedLat, longitude: clickedLng }
        this.tempNodeMarker = this.gridRendererService.buildNodeMarker(this.tempNode, this.handleNodeClick.bind(this));
        this.gridRendererService.addNodeToMap(this.tempNodeMarker);

        this.onTempNodeAdded.emit(this.tempNode);
    }

    handleNodeClick(clickedNode: NodeUI, nodes?: NodeUI[]): void {
        if (this.selectedAddOption !== "edge") {
            return;
        }

        if (!this.tempSrcNodeId) {
            this.handleSrcNodeClick(clickedNode, nodes);
            return;
        }
        
        if (this.tempDestNodeId) {
            this.clearTempEdge(false, nodes);
        }

        this.handleDestNodeClick(clickedNode, nodes);
    }

    private handleSrcNodeClick(clickedNode: NodeUI, nodes?: NodeUI[]) {
        this.tempSrcNodeId = clickedNode.id;
        this.tempEdge.srcBusId = clickedNode.id;
        
        nodes?.forEach((node) => {
            if (node.id === clickedNode.id) {
                node.isSelected = true;
                return;
            }
        });
    }

    private handleDestNodeClick(bus: NodeUI, nodes?: NodeUI[]) {
        this.tempDestNodeId = bus.id;
        this.tempEdge.destBusId = bus.id;

        nodes?.forEach((node) => {
            if (node.id !== bus.id) {
                return;
            }

            node.isSelected = true;
            const determined = this.gridRendererService.determineNodeLatLong(this.tempEdge, nodes);
            if (!determined) {
                return;
            }

            this.tempEdgePolyline = this.gridRendererService.buildEdgePolyline(this.tempEdge);
            this.gridRendererService.addEdgeToMap(this.tempEdgePolyline);

            this.onTempEdgeAdded.emit(this.tempEdge);

            return;
        });
    }

    clearTempEdge(clearSrcNode?: boolean, nodes?: NodeUI[]): void {
        this.gridRendererService.removeEdgeFromMap(this.tempEdgePolyline);

        // Clear selection of old dest node
        nodes?.forEach((node) => {
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

    getTempNodeMarker(): L.Marker | undefined {
        return this.tempNodeMarker;
    }
}