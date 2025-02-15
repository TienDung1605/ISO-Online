import dayjs from 'dayjs/esm';

import { ICheckTarget, NewCheckTarget } from './check-target.model';

export const sampleWithRequiredData: ICheckTarget = {
  id: 16830,
};

export const sampleWithPartialData: ICheckTarget = {
  id: 4559,
  inspectionTarget: 'alongside royal',
  evaluationLevelId: 11090,
  status: 'boohoo',
  createdAt: dayjs('2025-01-23T15:18'),
};

export const sampleWithFullData: ICheckTarget = {
  id: 22281,
  name: 'wingtip',
  inspectionTarget: 'kindly breathalyze',
  evaluationLevelId: 1237,
  status: 'fooey yowza accuse',
  createdAt: dayjs('2025-01-23T19:16'),
  updatedAt: dayjs('2025-01-23T07:14'),
  updateBy: 'aboard push bask',
};

export const sampleWithNewData: NewCheckTarget = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
