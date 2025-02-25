import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label-value',
  imports: [],
  templateUrl: './label-value.component.html',
  styleUrl: './label-value.component.css'
})
export class LabelValueComponent {
    @Input() label!: string;
    @Input() value?: string | number;
}
