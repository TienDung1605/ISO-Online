import dayjs from 'dayjs/esm';

export interface IScript {
  id: number;
  scriptCode?: string | null;
  scriptName?: string | null;
  timeStart?: dayjs.Dayjs | null;
  timeEnd?: dayjs.Dayjs | null;
  status?: string | null;
  updateBy?: string | null;
  frequency?: string | null;
  subjectOfAssetmentPlan?: string | null;
  codePlan?: string | null;
  namePlan?: string | null;
  timeCheck?: dayjs.Dayjs | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  participant?: string | null;
}

export type NewScript = Omit<IScript, 'id'> & { id: null };
