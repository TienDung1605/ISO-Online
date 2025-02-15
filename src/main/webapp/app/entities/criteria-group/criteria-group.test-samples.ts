import dayjs from 'dayjs/esm';

import { ICriteriaGroup, NewCriteriaGroup } from './criteria-group.model';

export const sampleWithRequiredData: ICriteriaGroup = {
  id: 26085,
};

export const sampleWithPartialData: ICriteriaGroup = {
  id: 19426,
  name: 'violin orientate evenly',
  updatedAt: dayjs('2025-01-24T02:23'),
  updateBy: 'boo till',
};

export const sampleWithFullData: ICriteriaGroup = {
  id: 7441,
  name: 'geez',
  status: 'aggregate loom',
  createdAt: dayjs('2025-01-23T04:45'),
  updatedAt: dayjs('2025-01-23T10:40'),
  updateBy: 'blah ew',
};

export const sampleWithNewData: NewCriteriaGroup = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
