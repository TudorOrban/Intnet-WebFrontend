import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid-map',
  imports: [CommonModule],
  templateUrl: './grid-map.component.html',
  styleUrl: './grid-map.component.css'
})
export class GridMapComponent implements OnInit {
    private map: any;
    private L: any;

    isMapInitialized: boolean = true;

    ngOnInit(): void {
        this.initMap();
    }

    async initMap() {
        this.L = await import('leaflet');

        this.map = this.L.map('map', {
            center: [39.8282, -98.5795],
            zoom: 5,
            worldCopyJump: true,
        });

        // Load tiles
        const tiles = this.L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                maxZoom: 18,
                minZoom: 3,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }
        );

        tiles.addTo(this.map);

        this.map.on('click', (e: L.LeafletMouseEvent) => {
            const clickedLat = e.latlng.lat;
            const clickedLng = e.latlng.lng;
            console.log(
                `Latitude: ${clickedLat}, Longitude: ${clickedLng}`
            );
        });
    }
}
