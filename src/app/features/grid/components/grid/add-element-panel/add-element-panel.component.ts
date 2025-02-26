import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { UIItem } from '../../../../../shared/common/types/Navigation';
import { gridAddOptions } from '../../../config/gridAddOptions';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '../../../../../shared/common/components/select/select.component';
import { GridStateService } from '../../../services/ui/grid-state.service';
import { GridElementCreationService } from '../../../services/ui/element-creation/grid-element-creation.service';

@Component({
  selector: 'app-add-element-panel',
  imports: [CommonModule, FontAwesomeModule, FormsModule, SelectComponent],
  templateUrl: './add-element-panel.component.html',
  styleUrl: './add-element-panel.component.css'
})
export class AddElementPanelComponent {
    @Input() isAddModeOn: boolean = false;
    
    addOptions: UIItem[] = gridAddOptions;

    constructor(
        readonly elementCreationService: GridElementCreationService,
        readonly gridStateService: GridStateService
    ) {}


    getAddOptionInfo(): string | undefined {
        const selectedOption = this.gridStateService.selectedAddOption;
        const addOption = this.addOptions.find(o => o.value === selectedOption);
        return addOption?.info;
    }
    

    faQuestion = faQuestion;
}
