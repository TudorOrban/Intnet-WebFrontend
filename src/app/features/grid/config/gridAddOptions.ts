import { faBatteryHalf, faCodeCommit, faCodeMerge, faIndustry, faPlug, faSolarPanel } from "@fortawesome/free-solid-svg-icons";

export const gridAddOptions = [
    {
        label: "Bus",
        value: "bus",
        icon: faCodeMerge
    },
    {
        label: "Edge",
        value: "edge",
        icon: faCodeCommit
    },
    {
        label: "Generator",
        value: "generator",
        icon: faIndustry
    },
    {
        label: "DER",
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