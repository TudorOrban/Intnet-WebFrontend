import { Component } from "@angular/core";
import {
    faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UIItem } from "../../../../shared/common/types/Navigation";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { sidebarItems } from "../../config/sidebarItems";
import { GridSearchDto } from "../../../grid/models/Grid";
import { GridSelectComponent } from "../../../grid/components/grid-select/grid-select.component";

@Component({
    selector: "app-sidebar",
    imports: [CommonModule, FontAwesomeModule, GridSelectComponent],
    templateUrl: "./sidebar.component.html",
    styleUrl: "./sidebar.component.css",
})
export class SidebarComponent {
    currentRoute?: string;
    sidebarItems = sidebarItems;
    grids: GridSearchDto[] = [];

    constructor(
        private readonly router: Router
    ) {}

    navigateTo(item?: UIItem) {
        if (!item) {
            return;
        }

        this.currentRoute = item.value;
        this.router.navigate([item?.link ?? "not-found"]);
    }

    faHome = faHome;
}
