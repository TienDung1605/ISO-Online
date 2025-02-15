import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ConvertService } from '../service/convert.service';
import { IConvert } from '../convert.model';
import { ConvertFormService } from './convert-form.service';

import { ConvertUpdateComponent } from './convert-update.component';

describe('Convert Management Update Component', () => {
  let comp: ConvertUpdateComponent;
  let fixture: ComponentFixture<ConvertUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let convertFormService: ConvertFormService;
  let convertService: ConvertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ConvertUpdateComponent],
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
      .overrideTemplate(ConvertUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConvertUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    convertFormService = TestBed.inject(ConvertFormService);
    convertService = TestBed.inject(ConvertService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const convert: IConvert = { id: 456 };

      activatedRoute.data = of({ convert });
      comp.ngOnInit();

      expect(comp.convert).toEqual(convert);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConvert>>();
      const convert = { id: 123 };
      jest.spyOn(convertFormService, 'getConvert').mockReturnValue(convert);
      jest.spyOn(convertService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ convert });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: convert }));
      saveSubject.complete();

      // THEN
      expect(convertFormService.getConvert).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(convertService.update).toHaveBeenCalledWith(expect.objectContaining(convert));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConvert>>();
      const convert = { id: 123 };
      jest.spyOn(convertFormService, 'getConvert').mockReturnValue({ id: null });
      jest.spyOn(convertService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ convert: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: convert }));
      saveSubject.complete();

      // THEN
      expect(convertFormService.getConvert).toHaveBeenCalled();
      expect(convertService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConvert>>();
      const convert = { id: 123 };
      jest.spyOn(convertService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ convert });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(convertService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
