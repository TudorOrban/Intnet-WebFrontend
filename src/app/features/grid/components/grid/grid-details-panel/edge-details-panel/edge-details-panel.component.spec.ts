import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdgeDetailsPanelComponent } from './edge-details-panel.component';

describe('EdgeDetailsPanelComponent', () => {
  let component: EdgeDetailsPanelComponent;
  let fixture: ComponentFixture<EdgeDetailsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdgeDetailsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdgeDetailsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
