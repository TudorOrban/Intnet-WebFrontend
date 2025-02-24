import { CommonModule } from '@angular/common';
import { Component, ComponentRef, EmbeddedViewRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { BusSearchDto } from '../../../models/Bus';
import { NodeComponent } from './node/node.component';
import { EdgeSearchDto, EdgeUI, TempEdgeUI } from '../../../models/Edge';
import { LeafletMouseEvent } from 'leaflet';

@Component({
  selector: 'app-grid-map',
  imports: [CommonModule],
  templateUrl: './grid-map.component.html',
  styleUrl: './grid-map.component.css'
})
export class GridMapComponent implements OnInit, OnChanges {
    @Input() nodes?: BusSearchDto[];
    @Input() edges?: EdgeUI[];
    @Input() selectedAddOption?: string;
    @Input() cancelCreateBusFlag: boolean = false; 
    @Input() cancelCreateEdgeFlag: boolean = false;
    @Output() onTempNodeAdded = new EventEmitter<BusSearchDto>();
    @Output() onTempEdgeAdded = new EventEmitter<TempEdgeUI>();

    private map: any;
    private L: any;

    private tempNodeMarker?: L.Marker;
    private tempNode?: BusSearchDto;
    private tempEdgePolyline?: L.Polyline;
    private tempEdge?: TempEdgeUI;

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

    private addNodeMarker(node: BusSearchDto): L.Marker {
        const componentRef = this.viewContainerRef.createComponent(NodeComponent);
        componentRef.instance.node = node;

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
            const srcNode = (this.nodes ?? []).find(n => n.id === edge.srcBusId);
            const destNode = (this.nodes ?? []).find(n => n.id === edge.destBusId);

            if (!srcNode?.latitude || !srcNode?.longitude || !destNode?.latitude || !destNode?.longitude) {
                return;
            }

            edge.srcNodeLatLong = [srcNode.latitude, srcNode.longitude];
            edge.destNodeLatLong = [destNode.latitude, destNode.longitude];
            
            const polyline = this.addEdgePolyline(edge);
            polyline.addTo(this.map);

            this.areEdgesRendered = true;
        });
    }

    private addEdgePolyline(edge: EdgeUI): L.Polyline {
        return this.L.polyline([edge.srcNodeLatLong, edge.destNodeLatLong], {
            color: "blue",
            weight: 3
        }); 
    }

    private handleMapClick(e: LeafletMouseEvent): void {
        const clickedLat = e.latlng.lat;
        const clickedLng = e.latlng.lng;
        console.log(`Latitude: ${clickedLat}, Longitude: ${clickedLng}`);

        switch (this.selectedAddOption) {
            case "bus":
                this.handleAddNodeMapClick(clickedLat, clickedLng);
                break;
            case "edge":

            
        }
    }

    private handleAddNodeMapClick(clickedLat: number, clickedLng: number): void {
        this.clearTempNode();

        this.tempNode = { id: 0, gridId: 0, latitude: clickedLat, longitude: clickedLng }
        this.tempNodeMarker = this.addNodeMarker(this.tempNode);
        this.tempNodeMarker.addTo(this.map);

        this.onTempNodeAdded.emit(this.tempNode);
    }

    private handleAddEdgeMapClick(clickedLat: number, clickedLng: number): void {
        const minimumDistFromNode = 20;


    }

    private getDistance(srcLat: number, srcLng: number, destLat: number, destLng: number): number {
        const deltaLat = destLat - srcLat;
        const deltaLng = destLng - srcLng;
        return Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng);
    }

    clearTempNode(): void {
        if (this.tempNodeMarker) {
            this.map.removeLayer(this.tempNodeMarker);
            this.tempNodeMarker = undefined;
        }
    }
}
