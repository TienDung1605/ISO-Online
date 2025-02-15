import dayjs from 'dayjs/esm';

import { IEvaluator, NewEvaluator } from './evaluator.model';

export const sampleWithRequiredData: IEvaluator = {
  id: 4099,
};

export const sampleWithPartialData: IEvaluator = {
  id: 17743,
  name: 'rabbi',
  userGroupId: 10573,
};

export const sampleWithFullData: IEvaluator = {
  id: 16489,
  name: 'giggle however',
  userGroupId: 2355,
  createdAt: dayjs('2025-01-23T07:41'),
  updatedAt: dayjs('2025-01-23T18:57'),
  status: 'lasting',
  updateBy: 'than safeguard',
};

export const sampleWithNewData: NewEvaluator = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
