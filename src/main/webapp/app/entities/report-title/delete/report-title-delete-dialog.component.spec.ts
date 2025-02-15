jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ReportTitleService } from '../service/report-title.service';

import { ReportTitleDeleteDialogComponent } from './report-title-delete-dialog.component';

describe('ReportTitle Management Delete Component', () => {
  let comp: ReportTitleDeleteDialogComponent;
  let fixture: ComponentFixture<ReportTitleDeleteDialogComponent>;
  let service: ReportTitleService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReportTitleDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(ReportTitleDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ReportTitleDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ReportTitleService);
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
