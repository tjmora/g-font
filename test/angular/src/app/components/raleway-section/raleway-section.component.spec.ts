import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RalewaySectionComponent } from './raleway-section.component';

describe('RalewaySectionComponent', () => {
  let component: RalewaySectionComponent;
  let fixture: ComponentFixture<RalewaySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RalewaySectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RalewaySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
