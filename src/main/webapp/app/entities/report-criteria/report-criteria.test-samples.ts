import dayjs from 'dayjs/esm';

import { IReportCriteria, NewReportCriteria } from './report-criteria.model';

export const sampleWithRequiredData: IReportCriteria = {
  id: 12927,
};

export const sampleWithPartialData: IReportCriteria = {
  id: 7105,
  criteriaName: 'closure healthily out',
  criteriaId: 9102,
  criteriaGroupId: 12800,
  updateBy: 'perfectly crumple queasy',
  reportId: 133,
};

export const sampleWithFullData: IReportCriteria = {
  id: 19198,
  criteriaName: 'till',
  criteriaGroupName: 'where',
  criteriaId: 27429,
  criteriaGroupId: 4457,
  status: 'however boo',
  createdAt: dayjs('2025-01-23T18:30'),
  updatedAt: dayjs('2025-01-24T02:46'),
  updateBy: 'playfully canvass',
  frequency: 'unimpressively',
  reportId: 7219,
};

export const sampleWithNewData: NewReportCriteria = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
