import { Injectable } from "@angular/core";
import { GridStateService } from "../grid-state.service";
import { GridEventService } from "../grid-event.service";

@Injectable({
    providedIn: "root"
})
export class GridDetailsService {

    constructor(
        private readonly gridStateService: GridStateService,
        private readonly gridEventService: GridEventService,
    ) {}
}