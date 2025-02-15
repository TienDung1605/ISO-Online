import dayjs from 'dayjs/esm';

export interface ICheckLevel {
  id: number;
  name?: string | null;
  status?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  updateBy?: string | null;
}

export type NewCheckLevel = Omit<ICheckLevel, 'id'> & { id: null };
