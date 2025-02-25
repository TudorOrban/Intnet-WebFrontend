import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NodeUI } from '../../../../models/Bus';
import { CommonModule } from '@angular/common';
import { NodeStyle, NodeType } from '../../../../models/GridStyles';
import { gridStyles } from '../../../../config/gridStyles';
import { GridEventService } from '../../../../services/ui/grid-event.service';
import { faIndustry } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-node',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './node.component.html',
  styleUrl: './node.component.css'
})
export class NodeComponent {
    @Input() node?: NodeUI;
    @Output() nodeClicked = new EventEmitter<NodeUI>();

    nodeStyle: NodeStyle = gridStyles.nodeStyles.default[NodeType.TRANSMISSION];
    
    faIndustry = faIndustry;

    constructor(
        private readonly gridEventService: GridEventService
    ) {
        this.gridEventService.nodeClicked$.subscribe((clickedNode: NodeUI) => {
            if (clickedNode.id !== this.node?.id) {
                this.updateStyles("default");
                return;
            }
            console.log("T:", this.node?.id);
        });
    }

    ngOnInit() {
        this.updateStyles("default");
    }

    clickNode(): void {
        if (!this.node) return;

        this.node.isSelected = true;
        this.updateStyles("selected");
        this.nodeClicked.emit(this.node);
    }

    hoverNode(): void {
        if (!this.node || this.node.isSelected) return;
        this.updateStyles("hovered");
    }

    unhoverNode(): void {
        if (!this.node || this.node.isSelected) return;
        this.updateStyles("default");
    }

    private updateStyles(state: "default" | "selected" | "hovered"): void {
        if (!this.node) return;

        const nodeType = this.node.isDistributionNode ? NodeType.DISTRIBUTION : NodeType.TRANSMISSION;
        const style = gridStyles.nodeStyles[state]?.[nodeType];
        if (style) {
            this.nodeStyle = style;
        }
    }

    getGeneratorPosition(index: number): any {
        const angle = (index / (this.node?.generators?.length || 1)) * 2 * Math.PI;
        const radius = 0.5 * this.nodeStyle.size;
        const x = radius * Math.cos(angle) + 8;
        const y = radius * Math.sin(angle) + 8;
        return {
            transform: `translate(${x}px, ${y}px)`,
        };
    }
}
