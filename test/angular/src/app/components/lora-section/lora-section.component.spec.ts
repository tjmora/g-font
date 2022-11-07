import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoraSectionComponent } from './lora-section.component';

describe('LoraSectionComponent', () => {
  let component: LoraSectionComponent;
  let fixture: ComponentFixture<LoraSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoraSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoraSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
