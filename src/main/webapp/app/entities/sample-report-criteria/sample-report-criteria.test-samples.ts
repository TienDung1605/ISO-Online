import dayjs from 'dayjs/esm';

import { ISampleReportCriteria, NewSampleReportCriteria } from './sample-report-criteria.model';

export const sampleWithRequiredData: ISampleReportCriteria = {
  id: 25532,
};

export const sampleWithPartialData: ISampleReportCriteria = {
  id: 17519,
  criteriaName: 'carrier',
  criteriaGroupName: 'ignorant broadly unfortunately',
  status: 'excuse joyful round',
  createdAt: dayjs('2025-01-24T01:02'),
  updateBy: 'robin globe ack',
  detail: 'cheat apropos round',
};

export const sampleWithFullData: ISampleReportCriteria = {
  id: 7258,
  criteriaName: 'embellished after worth',
  criteriaGroupName: 'indeed furiously once',
  criteriaId: 11750,
  criteriaGroupId: 18840,
  status: 'bah',
  createdAt: dayjs('2025-01-24T02:50'),
  updatedAt: dayjs('2025-01-23T09:44'),
  updateBy: 'try cruelly whose',
  frequency: 'above upper',
  sampleReportId: 2495,
  detail: 'complement sans than',
};

export const sampleWithNewData: NewSampleReportCriteria = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
