import dayjs from 'dayjs/esm';

import { IReportTitle, NewReportTitle } from './report-title.model';

export const sampleWithRequiredData: IReportTitle = {
  id: 16714,
};

export const sampleWithPartialData: IReportTitle = {
  id: 6264,
  name: 'given bah',
  source: 'how',
  field: 'um sprout',
  index: 2835,
  createdAt: dayjs('2025-01-23T08:45'),
  updatedAt: dayjs('2025-01-24T00:33'),
  reportId: 12391,
};

export const sampleWithFullData: IReportTitle = {
  id: 2867,
  name: 'rudiment likewise',
  source: 'occurrence ideal huzzah',
  field: 'fumbling like remould',
  dataType: 'sans',
  index: 15781,
  createdAt: dayjs('2025-01-23T22:32'),
  updatedAt: dayjs('2025-01-23T05:48'),
  updateBy: 'until',
  reportId: 26451,
};

export const sampleWithNewData: NewReportTitle = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
