jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CriteriaGroupService } from '../service/criteria-group.service';

import { CriteriaGroupDeleteDialogComponent } from './criteria-group-delete-dialog.component';

describe('CriteriaGroup Management Delete Component', () => {
  let comp: CriteriaGroupDeleteDialogComponent;
  let fixture: ComponentFixture<CriteriaGroupDeleteDialogComponent>;
  let service: CriteriaGroupService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CriteriaGroupDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(CriteriaGroupDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CriteriaGroupDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CriteriaGroupService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
