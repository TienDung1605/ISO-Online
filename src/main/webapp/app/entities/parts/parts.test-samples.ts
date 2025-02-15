import dayjs from 'dayjs/esm';

import { IParts, NewParts } from './parts.model';

export const sampleWithRequiredData: IParts = {
  id: 19670,
};

export const sampleWithPartialData: IParts = {
  id: 16974,
  name: 'stigmatise',
  createdAt: dayjs('2025-01-23T23:12'),
};

export const sampleWithFullData: IParts = {
  id: 13739,
  name: 'whose',
  status: 'impish',
  createdAt: dayjs('2025-01-23T18:44'),
  updatedAt: dayjs('2025-01-23T11:14'),
  updateBy: 'knowledgeably steady disguised',
};

export const sampleWithNewData: NewParts = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
