import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ReportCriteriaDetailComponent } from './report-criteria-detail.component';

describe('ReportCriteria Management Detail Component', () => {
  let comp: ReportCriteriaDetailComponent;
  let fixture: ComponentFixture<ReportCriteriaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCriteriaDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ReportCriteriaDetailComponent,
              resolve: { reportCriteria: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ReportCriteriaDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCriteriaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load reportCriteria on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ReportCriteriaDetailComponent);

      // THEN
      expect(instance.reportCriteria).toEqual(expect.objectContaining({ id: 123 }));
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
