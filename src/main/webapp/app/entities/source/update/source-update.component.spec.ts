import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SourceService } from '../service/source.service';
import { ISource } from '../source.model';
import { SourceFormService } from './source-form.service';

import { SourceUpdateComponent } from './source-update.component';

describe('Source Management Update Component', () => {
  let comp: SourceUpdateComponent;
  let fixture: ComponentFixture<SourceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sourceFormService: SourceFormService;
  let sourceService: SourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SourceUpdateComponent],
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
      .overrideTemplate(SourceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SourceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sourceFormService = TestBed.inject(SourceFormService);
    sourceService = TestBed.inject(SourceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const source: ISource = { id: 456 };

      activatedRoute.data = of({ source });
      comp.ngOnInit();

      expect(comp.source).toEqual(source);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISource>>();
      const source = { id: 123 };
      jest.spyOn(sourceFormService, 'getSource').mockReturnValue(source);
      jest.spyOn(sourceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ source });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: source }));
      saveSubject.complete();

      // THEN
      expect(sourceFormService.getSource).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sourceService.update).toHaveBeenCalledWith(expect.objectContaining(source));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISource>>();
      const source = { id: 123 };
      jest.spyOn(sourceFormService, 'getSource').mockReturnValue({ id: null });
      jest.spyOn(sourceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ source: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: source }));
      saveSubject.complete();

      // THEN
      expect(sourceFormService.getSource).toHaveBeenCalled();
      expect(sourceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISource>>();
      const source = { id: 123 };
      jest.spyOn(sourceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ source });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sourceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
