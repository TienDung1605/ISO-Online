import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TitleService } from '../service/title.service';
import { ITitle } from '../title.model';
import { TitleFormService } from './title-form.service';

import { TitleUpdateComponent } from './title-update.component';

describe('Title Management Update Component', () => {
  let comp: TitleUpdateComponent;
  let fixture: ComponentFixture<TitleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let titleFormService: TitleFormService;
  let titleService: TitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TitleUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TitleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TitleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    titleFormService = TestBed.inject(TitleFormService);
    titleService = TestBed.inject(TitleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const title: ITitle = { id: 456 };

      activatedRoute.data = of({ title });
      comp.ngOnInit();

      expect(comp.title).toEqual(title);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITitle>>();
      const title = { id: 123 };
      jest.spyOn(titleFormService, 'getTitle').mockReturnValue(title);
      jest.spyOn(titleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ title });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: title }));
      saveSubject.complete();

      // THEN
      expect(titleFormService.getTitle).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(titleService.update).toHaveBeenCalledWith(expect.objectContaining(title));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITitle>>();
      const title = { id: 123 };
      jest.spyOn(titleFormService, 'getTitle').mockReturnValue({ id: null });
      jest.spyOn(titleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ title: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: title }));
      saveSubject.complete();

      // THEN
      expect(titleFormService.getTitle).toHaveBeenCalled();
      expect(titleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITitle>>();
      const title = { id: 123 };
      jest.spyOn(titleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ title });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(titleService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
