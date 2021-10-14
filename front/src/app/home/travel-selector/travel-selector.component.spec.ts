import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelSelectorComponent } from './travel-selector.component';

describe('TravelSelectorComponent', () => {
  let component: TravelSelectorComponent;
  let fixture: ComponentFixture<TravelSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
