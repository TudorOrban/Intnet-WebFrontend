import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridHeaderComponent } from './grid-header.component';

describe('GridHeaderComponent', () => {
  let component: GridHeaderComponent;
  let fixture: ComponentFixture<GridHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
