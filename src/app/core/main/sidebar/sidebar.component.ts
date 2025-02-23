import { Component } from "@angular/core";
import {
  faHome,
  faBook,
  faFont,
  faSpellCheck,
  faComment,
  faSquarePollVertical,
  faUsersBetweenLines,
  faNetworkWired,
  faTowerObservation,
  faGear,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UIItem } from "../../../shared/common/types/Navigation";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-sidebar",
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: "./sidebar.component.html",
    styleUrl: "./sidebar.component.css",
})
export class SidebarComponent {
    currentRoute?: string;
    sidebarItems: UIItem[] = [
        { label: "Dashboard", value: "dashboard", icon: faSquarePollVertical, link: "/dashboard" },
        { label: "Organization", value: "organization", icon: faUsers, link: "/organization" },
        {
            label: "Grids",
            value: "grids",
            icon: faNetworkWired,
            link: "/grids",
        },
        {
            label: "Monitoring",
            value: "monitoring",
            icon: faTowerObservation,
            link: "/monitoring",
        },
        { label: "Settings", value: "settings", icon: faGear, link: "/settings" },
    ];

    constructor(private readonly router: Router) {}

    navigateTo(item?: UIItem) {
        if (!item) {
            return;
        }

        this.currentRoute = item.value;
        this.router.navigate([item?.link ?? "not-found"]);
    }

    faHome = faHome;
}
