import { Component, EventEmitter, Input, Output } from "@angular/core";
import { UIItem } from "../../types/Navigation";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@Component({
    selector: "app-select",
    imports: [CommonModule, FontAwesomeModule, FormsModule],
    templateUrl: "./select.component.html",
    styleUrl: "./select.component.css",
})
export class SelectComponent {
    @Input() items: UIItem[] = [];
    @Input() selectedItemValue: string | undefined;
    @Output() onItemSelected = new EventEmitter<string>();

    onSelectChange(): void {
        this.onItemSelected.emit(this.selectedItemValue);
    }
}
