import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayfairDisplaySectionComponent } from './playfair-display-section.component';

describe('PlayfairDisplaySectionComponent', () => {
  let component: PlayfairDisplaySectionComponent;
  let fixture: ComponentFixture<PlayfairDisplaySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayfairDisplaySectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayfairDisplaySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
