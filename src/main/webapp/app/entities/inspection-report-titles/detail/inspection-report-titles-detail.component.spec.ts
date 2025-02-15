import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InspectionReportTitlesDetailComponent } from './inspection-report-titles-detail.component';

describe('InspectionReportTitles Management Detail Component', () => {
  let comp: InspectionReportTitlesDetailComponent;
  let fixture: ComponentFixture<InspectionReportTitlesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectionReportTitlesDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: InspectionReportTitlesDetailComponent,
              resolve: { inspectionReportTitles: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(InspectionReportTitlesDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionReportTitlesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load inspectionReportTitles on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InspectionReportTitlesDetailComponent);

      // THEN
      expect(instance.inspectionReportTitles).toEqual(expect.objectContaining({ id: 123 }));
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
