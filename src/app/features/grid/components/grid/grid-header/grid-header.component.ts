import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
    faDiagramProject,
    faEdit,
    faPlus,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { GridStateService } from "../../../services/ui/grid-state.service";

@Component({
    selector: "app-grid-header",
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: "./grid-header.component.html",
    styleUrl: "./grid-header.component.css",
})
export class GridHeaderComponent {
    
    constructor(
        readonly gridStateService: GridStateService
    ) {}

    faPlus = faPlus;
    faTrash = faTrash;
    faEdit = faEdit;
    faDiagramProject = faDiagramProject;
}
