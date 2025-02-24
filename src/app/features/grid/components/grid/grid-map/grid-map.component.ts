import { CommonModule } from '@angular/common';
import { Component, EmbeddedViewRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { NodeUI } from '../../../models/Bus';
import { NodeComponent } from './node/node.component';
import { EdgeType, EdgeUI } from '../../../models/Edge';
import { LeafletMouseEvent } from 'leaflet';

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

    isMapInitialized: boolean = false;
    areEdgesRendered: boolean = false;

    constructor(
        private viewContainerRef: ViewContainerRef,
    ) {}

    ngOnInit(): void {
        this.initMap();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.renderNodesAndEdges(changes);

        if (changes["cancelCreateBusFlag"]?.currentValue) {
            
            this.clearTempNode();
            this.cancelCreateBusFlag = false;
        }
    }

    private renderNodesAndEdges(changes: SimpleChanges): void {
        if (changes["nodes"]?.currentValue) {
            this.nodes = changes["nodes"]?.currentValue;
            this.renderNodes();

            if (this.edges && !this.areEdgesRendered) {
                this.renderEdges();
            }
        }
        if (changes["edges"]?.currentValue) {
            this.edges = changes["edges"]?.currentValue;

            this.renderEdges();
        }
    }

    private async initMap() {
        this.isMapInitialized = true;

        this.L = await import('leaflet');

        this.map = this.L.map('map', {
            center: [39.8282, -98.5795],
            zoom: 8,
            worldCopyJump: true,
        });

        // Load tiles
        const tiles = this.L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                maxZoom: 20,
                minZoom: 5,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }
        );

        tiles.addTo(this.map);

        this.map.on('click', (e: L.LeafletMouseEvent) => {
            this.handleMapClick(e);
        });
    }

    private renderNodes(): void {
        if (!this.L) {
            return;
        }

        this.nodes?.forEach((node, index) => {
            const marker = this.addNodeMarker(node);
            marker.addTo(this.map);

            if (index == 0) {
                this.map.setView([node.latitude, node.longitude], 6); // TODO: Center around whole grid at appropriate zoom level
            }
        });
    }

    private addNodeMarker(node: NodeUI): L.Marker {
        const componentRef = this.viewContainerRef.createComponent(NodeComponent);
        componentRef.instance.node = node;
        componentRef.instance.nodeClicked.subscribe((clickedNode: NodeUI) => {
            this.handleNodeComponentClick(clickedNode);
        });

        const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        const marker = this.L.marker([node.latitude, node.longitude], {
            icon: this.L.divIcon({
                html: domElement,
                class: "flex items-center justify-center w-6 h-6",
                className: "div-icon-custom",
                iconSize: [20, 20]
            }),
        });

        return marker;
    }

    private renderEdges(): void {
        if (!this.L) {
            return;
        }

        this.edges?.forEach(edge => {
            const determined = this.determineNodeLatLong(edge);
            if (!determined) {
                return;
            }

            const polyline = this.addEdgePolyline(edge);
            polyline.addTo(this.map);

            this.areEdgesRendered = true;
        });
    }

    private determineNodeLatLong(edge: EdgeUI): boolean {
        const srcNode = (this.nodes ?? []).find(n => n.id === edge.srcBusId);
        const destNode = (this.nodes ?? []).find(n => n.id === edge.destBusId);

        if (!srcNode?.latitude || !srcNode?.longitude || !destNode?.latitude || !destNode?.longitude) {
            return false;
        }

        edge.srcNodeLatLong = [srcNode.latitude, srcNode.longitude];
        edge.destNodeLatLong = [destNode.latitude, destNode.longitude];
        return true;
    }

    private addEdgePolyline(edge: EdgeUI): L.Polyline {
        return this.L.polyline([edge.srcNodeLatLong, edge.destNodeLatLong], {
            color: "blue",
            weight: 3
        }); 
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
        this.clearTempNode();

        this.tempNode = { id: 0, gridId: 0, latitude: clickedLat, longitude: clickedLng }
        this.tempNodeMarker = this.addNodeMarker(this.tempNode);
        this.tempNodeMarker.addTo(this.map);

        this.onTempNodeAdded.emit(this.tempNode);
    }

    clearTempNode(): void {
        if (this.tempNodeMarker) {
            this.map.removeLayer(this.tempNodeMarker);
            this.tempNodeMarker = undefined;
        }
    }

    // Add Edge logic
    handleNodeComponentClick(bus: NodeUI): void {
        if (this.selectedAddOption !== "edge") {
            return;
        }

        if (!this.tempSrcNodeId) {
            this.tempSrcNodeId = bus.id;
            this.tempEdge.srcBusId = bus.id;

            this.nodes?.forEach((node) => {
                if (node.id === bus.id) {
                    node.isSelected = true;
                    return;
                }
            });
            return;
        }
        
        if (!this.tempDestNodeId) {
            this.tempDestNodeId = bus.id;
            this.tempEdge.destBusId = bus.id;

            this.nodes?.forEach((node) => {
                if (node.id === bus.id) {
                    node.isSelected = true;
                    const determined = this.determineNodeLatLong(this.tempEdge);
                    if (!determined) {
                        return;
                    }

                    this.tempEdgePolyline = this.addEdgePolyline(this.tempEdge);
                    this.tempEdgePolyline.addTo(this.map);
                    return;
                }
            });
            return;
        }
    }

}
