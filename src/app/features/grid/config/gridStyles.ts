import { GridStyles } from "../models/GridStyles";


export const gridStyles: GridStyles = {
    nodeStyles: {
        default: {
            TRANSMISSION: { color: "rgb(0, 112, 192)", size: 14, border: "1px solid rgb(64, 64, 64)" },
            DISTRIBUTION: { color: "rgb(0, 150, 64)", size: 12, border: "1px solid rgb(64, 64, 64)" }
        },
        hovered: {
            TRANSMISSION: { color: "rgb(173, 216, 230)", size: 4, border: "2px solid rgb(64, 64, 64)" },
            DISTRIBUTION: { color: "rgb(144, 238, 144)", size: 4, border: "2px solid rgb(64, 64, 64)" }
        },
        selected: {
            TRANSMISSION: { color: "rgb(0, 0, 139)", size: 18, border: "2px solid rgb(64, 64, 64)" },
            DISTRIBUTION: { color: "rgb(0, 100, 0)", size: 16, border: "2px solid rgb(64, 64, 64)" }
        },
    },
    edgeStyles: {
        default: {
            TRANSMISSION: { color: "rgb(0, 112, 192)", weight: 3 },
            DISTRIBUTION: { color: "rgb(0, 150, 64)", weight: 2 },
            TRANSFORMER: { color: "rgb(128, 0, 128)", weight: 2.5 }
        },
        hovered: {
            TRANSMISSION: { color: "rgb(173, 216, 230)", weight: 4 },
            DISTRIBUTION: { color: "rgb(144, 238, 144)", weight: 3 },
            TRANSFORMER: { color: "rgb(221, 160, 221)", weight: 3.5 }
        },
        selected: {
            TRANSMISSION: { color: "rgb(0, 0, 139)", weight: 5 },
            DISTRIBUTION: { color: "rgb(0, 100, 0)", weight: 4 },
            TRANSFORMER: { color: "rgb(75, 0, 130)", weight: 4.5 }
        }
    }
}