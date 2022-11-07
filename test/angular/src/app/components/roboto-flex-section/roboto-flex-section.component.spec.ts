import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotoFlexSectionComponent } from './roboto-flex-section.component';

describe('RobotoFlexSectionComponent', () => {
  let component: RobotoFlexSectionComponent;
  let fixture: ComponentFixture<RobotoFlexSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotoFlexSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotoFlexSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
