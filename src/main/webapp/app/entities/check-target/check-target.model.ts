import dayjs from 'dayjs/esm';

export interface ICheckTarget {
  id: number;
  name?: string | null;
  inspectionTarget?: string | null;
  evaluationLevelId?: number | null;
  checkGroupId?: number | null;
  status?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  updateBy?: string | null;
  evaluationLevel?: string | null;
}

export type NewCheckTarget = Omit<ICheckTarget, 'id'> & { id: null };
