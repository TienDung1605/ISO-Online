import dayjs from 'dayjs/esm';

import { ICheckLevel, NewCheckLevel } from './check-level.model';

export const sampleWithRequiredData: ICheckLevel = {
  id: 4153,
};

export const sampleWithPartialData: ICheckLevel = {
  id: 7337,
  name: 'marionberry humour',
  updateBy: 'quiver because',
};

export const sampleWithFullData: ICheckLevel = {
  id: 31271,
  name: 'wedding',
  status: 'wetly phew',
  createdAt: dayjs('2025-01-23T10:09'),
  updatedAt: dayjs('2025-01-23T17:50'),
  updateBy: 'forearm',
};

export const sampleWithNewData: NewCheckLevel = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
