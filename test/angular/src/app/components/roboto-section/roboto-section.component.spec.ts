import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotoSectionComponent } from './roboto-section.component';

describe('RobotoSectionComponent', () => {
  let component: RobotoSectionComponent;
  let fixture: ComponentFixture<RobotoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotoSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
