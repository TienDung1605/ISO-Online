import dayjs from 'dayjs/esm';

export interface IEvaluator {
  id: number;
  name?: string | null;
  userGroupId?: number | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  status?: string | null;
  updateBy?: string | null;
}

export type NewEvaluator = Omit<IEvaluator, 'id'> & { id: null };
