import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CheckerGroupDetailComponent } from './checker-group-detail.component';

describe('CheckerGroup Management Detail Component', () => {
  let comp: CheckerGroupDetailComponent;
  let fixture: ComponentFixture<CheckerGroupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckerGroupDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CheckerGroupDetailComponent,
              resolve: { checkerGroup: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CheckerGroupDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckerGroupDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load checkerGroup on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CheckerGroupDetailComponent);

      // THEN
      expect(instance.checkerGroup).toEqual(expect.objectContaining({ id: 123 }));
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
