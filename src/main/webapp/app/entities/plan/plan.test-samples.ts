import dayjs from 'dayjs/esm';

import { IPlan, NewPlan } from './plan.model';

export const sampleWithRequiredData: IPlan = {
  id: 10060,
};

export const sampleWithPartialData: IPlan = {
  id: 13730,
  code: 'what',
  subjectOfAssetmentPlan: 'helpfully atop numb',
  frequency: 'welcome',
  statusPlan: 'and beside bruised',
  reportTypeId: 15153,
  reportTypeName: 'pish',
  implementer: 'instead during',
  paticipant: 'hm undertaker yum',
  checkerGroup: 'lieu budget',
  checkerName: 'tan',
  checkerGroupId: 9696,
  gross: 'likewise incidentally',
  nameResult: 'plus',
  scriptId: 27208,
};

export const sampleWithFullData: IPlan = {
  id: 640,
  code: 'ick till furthermore',
  name: 'seethe jam lustrous',
  subjectOfAssetmentPlan: 'critical fooey',
  frequency: 'toward worth',
  timeStart: dayjs('2025-01-23T06:59'),
  timeEnd: dayjs('2025-01-23T11:01'),
  statusPlan: 'yowza',
  testObject: 'strap',
  reportTypeId: 28805,
  reportTypeName: 'grenade wonderfully diaper',
  numberOfCheck: 'lanky finally',
  implementer: 'tease',
  paticipant: 'renew',
  checkerGroup: 'vainly',
  checkerName: 'casserole',
  checkerGroupId: 31439,
  checkerId: 1319,
  gross: 'quiet',
  timeCheck: 'because annually',
  nameResult: 'shakily fondly owlishly',
  scriptId: 22649,
  createBy: 'instantly',
  status: 'interior wonderfully',
  createdAt: dayjs('2025-01-23T13:53'),
  updatedAt: dayjs('2025-01-23T14:37'),
  updateBy: 'whoever before',
};

export const sampleWithNewData: NewPlan = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
