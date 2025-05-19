import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarizePlanComponent } from './summarize-plan.component';

describe('SummarizePlanComponent', () => {
  let component: SummarizePlanComponent;
  let fixture: ComponentFixture<SummarizePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummarizePlanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SummarizePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
