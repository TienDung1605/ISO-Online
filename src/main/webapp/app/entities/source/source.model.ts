import dayjs from 'dayjs/esm';

export interface ISource {
  id: number;
  name?: string | null;
  source?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  createBy?: string | null;
}

export type NewSource = Omit<ISource, 'id'> & { id: null };
