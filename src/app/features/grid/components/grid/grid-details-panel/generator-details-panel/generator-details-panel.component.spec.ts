import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorDetailsPanelComponent } from './generator-details-panel.component';

describe('GeneratorDetailsPanelComponent', () => {
  let component: GeneratorDetailsPanelComponent;
  let fixture: ComponentFixture<GeneratorDetailsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratorDetailsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratorDetailsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
