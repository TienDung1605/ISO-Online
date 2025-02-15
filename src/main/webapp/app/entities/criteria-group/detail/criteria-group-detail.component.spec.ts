import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CriteriaGroupDetailComponent } from './criteria-group-detail.component';

describe('CriteriaGroup Management Detail Component', () => {
  let comp: CriteriaGroupDetailComponent;
  let fixture: ComponentFixture<CriteriaGroupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriteriaGroupDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CriteriaGroupDetailComponent,
              resolve: { criteriaGroup: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CriteriaGroupDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaGroupDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load criteriaGroup on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CriteriaGroupDetailComponent);

      // THEN
      expect(instance.criteriaGroup).toEqual(expect.objectContaining({ id: 123 }));
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
