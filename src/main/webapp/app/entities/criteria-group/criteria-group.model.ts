import dayjs from 'dayjs/esm';

export interface ICriteriaGroup {
  id: number;
  name?: string | null;
  status?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  updateBy?: string | null;
}

export type NewCriteriaGroup = Omit<ICriteriaGroup, 'id'> & { id: null };
