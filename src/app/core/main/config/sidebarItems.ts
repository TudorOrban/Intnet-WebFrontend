import {
    faGear,
    faNetworkWired,
    faSquarePollVertical,
    faTowerObservation,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { UIItem } from "../../../shared/common/types/Navigation";

export const sidebarItems: UIItem[] = [
    {
        label: "Dashboard",
        value: "dashboard",
        icon: faSquarePollVertical,
        link: "/dashboard",
    },
    {
        label: "Organization",
        value: "organization",
        icon: faUsers,
        link: "/organization",
    },
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
    {
        label: "Settings",
        value: "settings",
        icon: faGear,
        link: "/settings",
    },
];
