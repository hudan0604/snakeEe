import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndOfGameComponent } from './end-of-game.component';

describe('EndOfGameComponent', () => {
  let component: EndOfGameComponent;
  let fixture: ComponentFixture<EndOfGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndOfGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndOfGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
