import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalCreatorComponent } from './additional-creator.component';

describe('AdditionalCreatorComponent', () => {
  let component: AdditionalCreatorComponent;
  let fixture: ComponentFixture<AdditionalCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
