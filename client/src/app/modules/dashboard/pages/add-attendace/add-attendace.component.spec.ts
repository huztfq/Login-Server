import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttendaceComponent } from './add-attendace.component';

describe('AddAttendaceComponent', () => {
  let component: AddAttendaceComponent;
  let fixture: ComponentFixture<AddAttendaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAttendaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAttendaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
