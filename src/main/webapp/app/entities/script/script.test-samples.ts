import dayjs from 'dayjs/esm';

import { IScript, NewScript } from './script.model';

export const sampleWithRequiredData: IScript = {
  id: 569,
};

export const sampleWithPartialData: IScript = {
  id: 25060,
  scriptCode: 'snarling or following',
  scriptName: 'geez furthermore',
  timeStart: dayjs('2025-01-23T11:20'),
  frequency: 'but',
  codePlan: 'zowie',
  namePlan: 'whereas slide',
  timeCheck: dayjs('2025-01-24T01:29'),
  updatedAt: dayjs('2025-01-23T06:02'),
  participant: 'than though equalize',
};

export const sampleWithFullData: IScript = {
  id: 11024,
  scriptCode: 'gah whoa difficult',
  scriptName: 'welcome',
  timeStart: dayjs('2025-01-23T05:08'),
  timeEnd: dayjs('2025-01-24T01:15'),
  status: 'um past nervously',
  updateBy: 'disembodiment for beneath',
  frequency: 'worth finally amongst',
  subjectOfAssetmentPlan: 'dwell crinkle cash',
  codePlan: 'literate',
  namePlan: 'wherever midst whenever',
  timeCheck: dayjs('2025-01-23T20:42'),
  createdAt: dayjs('2025-01-23T14:41'),
  updatedAt: dayjs('2025-01-23T12:39'),
  participant: 'beside because',
};

export const sampleWithNewData: NewScript = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
