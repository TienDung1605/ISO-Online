import dayjs from 'dayjs/esm';

import { IInspectionReportTitles, NewInspectionReportTitles } from './inspection-report-titles.model';

export const sampleWithRequiredData: IInspectionReportTitles = {
  id: 29200,
};

export const sampleWithPartialData: IInspectionReportTitles = {
  id: 15652,
  nameTitle: 'daring',
  field: 'diffuse forceful solemnly',
};

export const sampleWithFullData: IInspectionReportTitles = {
  id: 20262,
  nameTitle: 'nor pro',
  source: 'grouchy',
  field: 'snoopy lurk',
  dataType: 'amidst threadbare',
  timeCreate: dayjs('2025-01-23T08:32'),
  timeUpdate: dayjs('2025-01-23T06:55'),
  sampleReportId: 16023,
};

export const sampleWithNewData: NewInspectionReportTitles = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
