import dayjs from 'dayjs/esm';

import { ISampleReport, NewSampleReport } from './sample-report.model';

export const sampleWithRequiredData: ISampleReport = {
  id: 11689,
};

export const sampleWithPartialData: ISampleReport = {
  id: 32070,
  updateBy: 'down promptly',
  reportType: 'kneel silky',
  reportTypeId: 8006,
};

export const sampleWithFullData: ISampleReport = {
  id: 11563,
  name: 'meaty next',
  status: 27691,
  createdAt: dayjs('2025-01-23T15:35'),
  updatedAt: dayjs('2025-01-24T02:28'),
  updateBy: 'coolly anguished',
  frequency: 'suppose',
  code: 'rightfully',
  reportType: 'shackle nearly whoa',
  reportTypeId: 15382,
};

export const sampleWithNewData: NewSampleReport = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
