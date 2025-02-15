import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SampleReportCriteriaDetailComponent } from './sample-report-criteria-detail.component';

describe('SampleReportCriteria Management Detail Component', () => {
  let comp: SampleReportCriteriaDetailComponent;
  let fixture: ComponentFixture<SampleReportCriteriaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleReportCriteriaDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: SampleReportCriteriaDetailComponent,
              resolve: { sampleReportCriteria: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(SampleReportCriteriaDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleReportCriteriaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sampleReportCriteria on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SampleReportCriteriaDetailComponent);

      // THEN
      expect(instance.sampleReportCriteria).toEqual(expect.objectContaining({ id: 123 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
