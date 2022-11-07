import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatoSectionComponent } from './lato-section.component';

describe('LatoSectionComponent', () => {
  let component: LatoSectionComponent;
  let fixture: ComponentFixture<LatoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatoSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
