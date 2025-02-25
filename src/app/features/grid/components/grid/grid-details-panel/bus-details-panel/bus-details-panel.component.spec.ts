import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusDetailsPanelComponent } from './bus-details-panel.component';

describe('BusDetailsPanelComponent', () => {
  let component: BusDetailsPanelComponent;
  let fixture: ComponentFixture<BusDetailsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusDetailsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusDetailsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
