import dayjs from 'dayjs/esm';

import { IReport, NewReport } from './report.model';

export const sampleWithRequiredData: IReport = {
  id: 19583,
};

export const sampleWithPartialData: IReport = {
  id: 26928,
  name: 'requisition',
  code: 'courageously how before',
  sampleReportId: 552,
  testOfObject: 'supposing frankly helpfully',
  checker: 'gang banter',
  status: 'carbonize loosely',
  frequency: 'gosh',
  reportTypeId: 11385,
  scoreScale: 'ack deviate watcher',
  planId: 'froth evidence',
  user: 'riding along',
};

export const sampleWithFullData: IReport = {
  id: 690,
  name: 'supplement via',
  code: 'hence so huzzah',
  sampleReportId: 8049,
  testOfObject: 'repeat',
  checker: 'picturise live',
  status: 'finally harsh buzzing',
  frequency: 'drat tonify supposing',
  reportType: 'singing',
  reportTypeId: 18733,
  createdAt: dayjs('2025-01-23T15:02'),
  updatedAt: dayjs('2025-01-23T19:28'),
  scoreScale: 'delightful',
  updateBy: 'exhausted',
  planId: 'blah incur',
  user: 'when but',
};

export const sampleWithNewData: NewReport = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
