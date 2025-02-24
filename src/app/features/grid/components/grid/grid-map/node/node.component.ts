import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NodeUI } from '../../../../models/Bus';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-node',
  imports: [CommonModule],
  templateUrl: './node.component.html',
  styleUrl: './node.component.css'
})
export class NodeComponent {
    @Input() node?: NodeUI;
    @Output() nodeClicked = new EventEmitter<NodeUI>();

    clickNode(): void {
        this.nodeClicked.emit(this.node);
    }
}
