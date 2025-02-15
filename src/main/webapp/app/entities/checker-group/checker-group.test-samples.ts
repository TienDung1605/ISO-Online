import dayjs from 'dayjs/esm';

import { ICheckerGroup, NewCheckerGroup } from './checker-group.model';

export const sampleWithRequiredData: ICheckerGroup = {
  id: 6456,
};

export const sampleWithPartialData: ICheckerGroup = {
  id: 5077,
  name: 'if summit pro',
  status: 'enthusiastically rude',
};

export const sampleWithFullData: ICheckerGroup = {
  id: 30258,
  name: 'closely colorfully',
  status: 'abaft scornful',
  createdAt: dayjs('2025-01-24T01:20'),
  updatedAt: dayjs('2025-01-24T02:38'),
  updateBy: 'insult rash cause',
};

export const sampleWithNewData: NewCheckerGroup = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
