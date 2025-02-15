import dayjs from 'dayjs/esm';

export interface IFrequency {
  id: number;
  name?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  status?: string | null;
  updateBy?: string | null;
}

export type NewFrequency = Omit<IFrequency, 'id'> & { id: null };
