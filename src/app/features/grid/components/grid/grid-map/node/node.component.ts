import { Component, Input } from '@angular/core';
import { BusSearchDto } from '../../../../models/Bus';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-node',
  imports: [CommonModule],
  templateUrl: './node.component.html',
  styleUrl: './node.component.css'
})
export class NodeComponent {
    @Input() node?: BusSearchDto;

}
