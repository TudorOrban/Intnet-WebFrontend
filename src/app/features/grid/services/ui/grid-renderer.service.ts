import { EmbeddedViewRef, Injectable, SimpleChanges, ViewContainerRef } from "@angular/core";
import { NodeUI } from "../../models/Bus";
import { NodeComponent } from "../../components/grid/grid-map/node/node.component";
import { EdgeUI } from "../../models/Edge";

@Injectable({
    providedIn: "root"
})
export class GridRendererService {
    private map: L.Map | undefined;
    private L: any;
    private viewContainerRef: ViewContainerRef | undefined;

    async initMap(
        mapElementId: string, 
        viewContainerRef: ViewContainerRef,
        handleMapClick?: (e: L.LeafletMouseEvent) => void,
    ): Promise<void> {
        this.L = await import('leaflet');
        this.viewContainerRef = viewContainerRef;

        this.map = this.L.map(mapElementId, {
            center: [39.8282, -98.5795],
            zoom: 8,
            worldCopyJump: true,
        });

        this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            minZoom: 5,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);

        this.map?.on("click", (e: L.LeafletMouseEvent) => {
            handleMapClick?.(e);
        });
    }

    renderNodes(
        nodes?: NodeUI[],
        handleNodeClick?: (clickedNode: NodeUI) => void
    ): void {
        if (!this.L || !this.map) return;

        nodes?.forEach((node, index) => {
            const marker = this.addNodeMarker(node, handleNodeClick);
            marker.addTo(this.map!);

            if (index === 0) {
                this.map!.setView([node.latitude, node.longitude], 6);
            }
        });
    }

    renderEdges(edges?: EdgeUI[], nodes?: NodeUI[]): void {
        if (!this.L || !this.map) return;

        edges?.forEach((edge) => {
            const determined = this.determineNodeLatLong(edge, nodes);
            if (!determined) return;

            const polyline = this.addEdgePolyline(edge);
            polyline.addTo(this.map!);
        });
    }

    addNodeMarker(
        node: NodeUI, 
        handleNodeClick?: (clickedNode: NodeUI) => void
    ): L.Marker {
        if (!this.viewContainerRef) {
            throw new Error('ViewContainerRef is not available.');
        }

        const componentRef = this.viewContainerRef.createComponent(NodeComponent);
        componentRef.instance.node = node;
        componentRef.instance.nodeClicked.subscribe((clickedNode: NodeUI) => {
            handleNodeClick?.(clickedNode);
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

    determineNodeLatLong(edge: EdgeUI, nodes?: NodeUI[]): boolean {
        const srcNode = nodes?.find((n) => n.id === edge.srcBusId);
        const destNode = nodes?.find((n) => n.id === edge.destBusId);

        if (!srcNode?.latitude || !srcNode?.longitude || !destNode?.latitude || !destNode?.longitude) {
            return false;
        }

        edge.srcNodeLatLong = [srcNode.latitude, srcNode.longitude];
        edge.destNodeLatLong = [destNode.latitude, destNode.longitude];
        return true;
    }

    addEdgePolyline(edge: EdgeUI): L.Polyline {
        return this.L.polyline([edge.srcNodeLatLong, edge.destNodeLatLong], {
            color: 'blue',
            weight: 3,
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