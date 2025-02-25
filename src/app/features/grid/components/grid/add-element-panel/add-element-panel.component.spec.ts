import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddElementPanelComponent } from './add-element-panel.component';

describe('AddElementPanelComponent', () => {
  let component: AddElementPanelComponent;
  let fixture: ComponentFixture<AddElementPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddElementPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddElementPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
