import { faBatteryHalf, faCodeCommit, faCodeMerge, faIndustry, faPlug, faSolarPanel } from "@fortawesome/free-solid-svg-icons";
import { UIItem } from "../../../shared/common/types/Navigation";

export const gridAddOptions: UIItem[] = [
    {
        label: "Bus",
        value: "bus",
        icon: faCodeMerge,
        info: "Click anywhere on the map to place a bus node."
    },
    {
        label: "Edge",
        value: "edge",
        icon: faCodeCommit,
        info: "Click on two bus nodes to connect them."
    },
    {
        label: "Generator",
        value: "generator",
        icon: faIndustry,
        info: "Click on a bus node to add a Generator to it."
    },
    {
        label: "Load",
        value: "load",
        icon: faPlug
    },
    {
        label: "DER",
        value: "der",
        icon: faSolarPanel
    },
    {
        label: "Storage",
        value: "storage",
        icon: faBatteryHalf
    },
];