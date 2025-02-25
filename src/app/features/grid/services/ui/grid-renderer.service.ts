import { EmbeddedViewRef, Injectable, SimpleChanges, ViewContainerRef } from "@angular/core";
import { NodeUI } from "../../models/Bus";
import { NodeComponent } from "../../components/grid/grid-map/node/node.component";
import { EdgeType, EdgeUI } from "../../models/Edge";
import { GridStateService } from "./grid-state.service";
import { GridEventService } from "./grid-event.service";

@Injectable({
    providedIn: "root"
})
export class GridRendererService {
    private map: L.Map | undefined;
    private L: any;
    private viewContainerRef: ViewContainerRef | undefined;

    private readonly MAP_CENTER: L.LatLngExpression = [39.8282, -98.5795];
    private readonly MAP_CURRENT_ZOOM: number = 6;
    private readonly MAP_MIN_ZOOM: number = 4;
    private readonly MAP_MAX_ZOOM: number = 20;

    constructor(
        private readonly gridStateService: GridStateService,
        private readonly gridEventService: GridEventService
    ) {}

    async initMap(
        mapElementId: string, 
        viewContainerRef: ViewContainerRef,
    ): Promise<void> {
        this.L = await import('leaflet');
        this.viewContainerRef = viewContainerRef;

        this.map = this.L.map(mapElementId, {
            center: this.MAP_CENTER,
            zoom: this.MAP_CURRENT_ZOOM,
            worldCopyJump: true,
        });

        this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: this.MAP_MIN_ZOOM,
            maxZoom: this.MAP_MAX_ZOOM,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);

        this.map?.on("click", (e: L.LeafletMouseEvent) => {
            this.gridEventService.publishMapClicked(e);
        });
    }

    renderGraph(): void {
        this.renderNodes();
        this.renderEdges();
    }

    private renderNodes(): void {
        if (!this.L || !this.map) return;

        const nodes = this.gridStateService.nodes;
        nodes.forEach((node, index) => {
            node.isDistributionNode = this.isDistributionNode(node);

            const marker = this.buildNodeMarker(node);
            marker.addTo(this.map!);

            if (index === 0) {
                this.map!.setView([node.latitude, node.longitude], this.MAP_CURRENT_ZOOM);
            }
        });
    }

    private isDistributionNode(node: NodeUI): boolean {
        let isDistributionNode = true;
        
        const edges = this.gridStateService.edges;
        edges.forEach((edge) => {
            const isAdjacentEdgeTransmission = 
                (edge.srcBusId === node.id || edge.destBusId === node.id) && edge.edgeType === EdgeType.TRANSMISSION
            if (isAdjacentEdgeTransmission) {
                isDistributionNode = false;
                return;
            }
        });

        return isDistributionNode;
    }

    private renderEdges(): void {
        if (!this.L || !this.map) return;

        const edges = this.gridStateService.edges;
        edges.forEach((edge) => {
            const determined = this.determineNodeLatLong(edge);
            if (!determined) return;

            const polyline = this.buildEdgePolyline(edge);
            polyline.addTo(this.map!);
        });
    }

    buildNodeMarker(node: NodeUI): L.Marker {
        if (!this.viewContainerRef) {
            throw new Error('ViewContainerRef is not available.');
        }

        const componentRef = this.viewContainerRef.createComponent(NodeComponent);
        componentRef.instance.node = node;
        componentRef.instance.nodeClicked.subscribe((clickedNode: NodeUI) => {
            this.gridEventService.publishNodeClicked(clickedNode);
        });

        const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        return this.L.marker([node.latitude, node.longitude], {
            icon: this.L.divIcon({
                html: domElement,
                class: 'flex items-center justify-center w-5 h-5',
                className: 'div-icon-custom',
                iconSize: [16, 16],
            }),
        });
    }

    determineNodeLatLong(edge: EdgeUI): boolean {
        const nodes = this.gridStateService.nodes;
        const srcNode = nodes?.find((n) => n.id === edge.srcBusId);
        const destNode = nodes?.find((n) => n.id === edge.destBusId);

        if (!srcNode?.latitude || !srcNode?.longitude || !destNode?.latitude || !destNode?.longitude) {
            return false;
        }

        edge.srcNodeLatLong = [srcNode.latitude, srcNode.longitude];
        edge.destNodeLatLong = [destNode.latitude, destNode.longitude];
        return true;
    }

    buildEdgePolyline(edge: EdgeUI): L.Polyline {
        return this.L.polyline([edge.srcNodeLatLong, edge.destNodeLatLong], {
            color: edge.edgeType === EdgeType.TRANSMISSION ? "blue" : "green",
            weight: edge.edgeType === EdgeType.TRANSMISSION ? 3 : 2,
        });
    }

    addNodeToMap(nodeMarker: L.Marker): void {
        nodeMarker.addTo(this.map!);
    }

    addEdgeToMap(edgePolyline: L.Polyline): void {
        edgePolyline.addTo(this.map!);
    }

    removeNodeFromMap(nodeMarker?: L.Marker): void {
        if (nodeMarker) {
            this.map?.removeLayer(nodeMarker);
            nodeMarker = undefined;
        }
    }

    removeEdgeFromMap(edgePolyline?: L.Polyline): void {
        if (edgePolyline) {
            this.map?.removeLayer(edgePolyline);
            edgePolyline = undefined;
        }
    }

    getMap(): L.Map | undefined {
        return this.map;
    }

    getL(): any | undefined {
        return this.L;
    }
}