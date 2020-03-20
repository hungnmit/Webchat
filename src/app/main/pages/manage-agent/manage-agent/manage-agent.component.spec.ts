import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAgentComponent } from './manage-agent.component';

describe('ManageAgentComponent', () => {
  let component: ManageAgentComponent;
  let fixture: ComponentFixture<ManageAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
