import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSelectComponent } from './grid-select.component';

describe('GridSelectComponent', () => {
  let component: GridSelectComponent;
  let fixture: ComponentFixture<GridSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
