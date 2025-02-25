import dayjs from 'dayjs/esm';

import { IFields, NewFields } from './fields.model';

export const sampleWithRequiredData: IFields = {
  id: 7577,
};

export const sampleWithPartialData: IFields = {
  id: 16299,
  updatedAt: dayjs('2025-02-24T17:02'),
  createBy: 'ew best bare',
};

export const sampleWithFullData: IFields = {
  id: 32214,
  name: 'absent',
  fieldName: 'mess blissfully',
  sourceId: 30391,
  createdAt: dayjs('2025-02-24T19:13'),
  updatedAt: dayjs('2025-02-25T02:30'),
  createBy: 'overconfidently equal',
};

export const sampleWithNewData: NewFields = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
