import dayjs from 'dayjs/esm';

import { ISource, NewSource } from './source.model';

export const sampleWithRequiredData: ISource = {
  id: 21129,
};

export const sampleWithPartialData: ISource = {
  id: 3591,
  name: 'within drown ouch',
  source: 'havoc honestly',
  createdAt: dayjs('2025-02-24T14:12'),
};

export const sampleWithFullData: ISource = {
  id: 12917,
  name: 'few',
  source: 'glare alongside instead',
  createdAt: dayjs('2025-02-25T01:57'),
  updatedAt: dayjs('2025-02-24T15:20'),
  createBy: 'wretched why',
};

export const sampleWithNewData: NewSource = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
