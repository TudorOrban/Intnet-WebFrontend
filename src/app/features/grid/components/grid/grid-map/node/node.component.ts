import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeneratorUIData, NodeUI } from '../../../../models/Bus';
import { CommonModule } from '@angular/common';
import { NodeStyle, NodeType } from '../../../../models/GridStyles';
import { gridStyles } from '../../../../config/gridStyles';
import { GridEventService } from '../../../../services/ui/grid-event.service';
import { faIndustry } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GridStateService } from '../../../../services/ui/grid-state.service';

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

    constructor(
        private readonly gridEventService: GridEventService,
        readonly gridStateService: GridStateService,
    ) {
        this.gridEventService.nodeClicked$.subscribe((clickedNode: NodeUI) => {
            if (clickedNode.id !== this.node?.id) {
                this.updateStyles("default");
            }
        });
    }

    ngOnInit() {
        this.updateStyles("default");
        if (!this.node) return;
        this.calculateGeneratorPositions();
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

    clickGenerator(generatorId: number): void {
        if (!this.node) return;

        const generator = this.node.generators?.find(g => g.id === generatorId);
        if (!generator) return;

        // this.node.generators?.forEach(g => g.isSelected = false);
        // generator.isSelected = true;

        // this.gridStateService.setSelectedGenerator(generator);
        this.gridEventService.publishGeneratorClicked(generator);
    }

    // Util
    calculateGeneratorPositions(): GeneratorUIData[] {
        if (!this.node?.generators || this.node?.generators.length === 0 || !this.nodeStyle) {
            return [];
        }
    
        const positions: GeneratorUIData[] = [];
        const radius = 1.3 * this.nodeStyle.size;
        const yOffset = 0.5 * this.nodeStyle.size;
    
        for (let i = 0; i < this.node.generators.length; i++) {
            const angle = (i / this.node.generators.length) * 2 * Math.PI;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle) - yOffset;

            this.node.generators[i] = {
                ...this.node.generators[i],
                x, y,
                isSelected: false
            }
        }
    
        return positions;
    }

    faIndustry = faIndustry;
    Object = Object;
}
