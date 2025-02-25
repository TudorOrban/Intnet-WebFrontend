import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NodeUI } from '../../../../models/Bus';
import { CommonModule } from '@angular/common';
import { NodeStyle, NodeType } from '../../../../models/GridStyles';
import { gridStyles } from '../../../../config/gridStyles';

@Component({
  selector: 'app-node',
  imports: [CommonModule],
  templateUrl: './node.component.html',
  styleUrl: './node.component.css'
})
export class NodeComponent {
    @Input() node?: NodeUI;
    @Output() nodeClicked = new EventEmitter<NodeUI>();

    nodeStyle: NodeStyle = gridStyles.nodeStyles.default[NodeType.TRANSMISSION];

    ngOnInit() {
        if (!this.node) return;

        const nodeType = this.node.isDistributionNode ? NodeType.DISTRIBUTION : NodeType.TRANSMISSION;
        this.nodeStyle = gridStyles.nodeStyles.default[nodeType];
    }

    clickNode(): void {
        if (!this.node) return;

        const nodeType = this.node.isDistributionNode ? NodeType.DISTRIBUTION : NodeType.TRANSMISSION;
        const style = gridStyles.nodeStyles.selected?.[nodeType];
        if (style) {
            this.nodeStyle = style;
        }
        this.nodeClicked.emit(this.node);
    }
}
