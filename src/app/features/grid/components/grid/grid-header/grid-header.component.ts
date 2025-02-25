import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
    faDiagramProject,
    faEdit,
    faPlus,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "app-grid-header",
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: "./grid-header.component.html",
    styleUrl: "./grid-header.component.css",
})
export class GridHeaderComponent {
    isAddModeOn: boolean = false;
    isEditModeOn: boolean = false;
    isDeleteModeOn: boolean = false;

    toggleAddMode(): void {
        this.isAddModeOn = !this.isAddModeOn;
    }

    toggleEditMode(): void {
        this.isEditModeOn = !this.isEditModeOn;
    }

    toggleDeleteMode(): void {
        this.isDeleteModeOn = !this.isDeleteModeOn;
    }

    faPlus = faPlus;
    faTrash = faTrash;
    faEdit = faEdit;
    faDiagramProject = faDiagramProject;
}
