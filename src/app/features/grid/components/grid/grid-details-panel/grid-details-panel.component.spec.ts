import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDetailsPanelComponent } from './grid-details-panel.component';

describe('GridDetailsPanelComponent', () => {
  let component: GridDetailsPanelComponent;
  let fixture: ComponentFixture<GridDetailsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridDetailsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridDetailsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
