import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FieldsService } from '../service/fields.service';
import { IFields } from '../fields.model';
import { FieldsFormService } from './fields-form.service';

import { FieldsUpdateComponent } from './fields-update.component';

describe('Fields Management Update Component', () => {
  let comp: FieldsUpdateComponent;
  let fixture: ComponentFixture<FieldsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fieldsFormService: FieldsFormService;
  let fieldsService: FieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), FieldsUpdateComponent],
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
      .overrideTemplate(FieldsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FieldsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fieldsFormService = TestBed.inject(FieldsFormService);
    fieldsService = TestBed.inject(FieldsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const fields: IFields = { id: 456 };

      activatedRoute.data = of({ fields });
      comp.ngOnInit();

      expect(comp.fields).toEqual(fields);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFields>>();
      const fields = { id: 123 };
      jest.spyOn(fieldsFormService, 'getFields').mockReturnValue(fields);
      jest.spyOn(fieldsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fields });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fields }));
      saveSubject.complete();

      // THEN
      expect(fieldsFormService.getFields).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(fieldsService.update).toHaveBeenCalledWith(expect.objectContaining(fields));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFields>>();
      const fields = { id: 123 };
      jest.spyOn(fieldsFormService, 'getFields').mockReturnValue({ id: null });
      jest.spyOn(fieldsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fields: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fields }));
      saveSubject.complete();

      // THEN
      expect(fieldsFormService.getFields).toHaveBeenCalled();
      expect(fieldsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFields>>();
      const fields = { id: 123 };
      jest.spyOn(fieldsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fields });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fieldsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
