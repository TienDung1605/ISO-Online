import dayjs from 'dayjs/esm';

export interface IConvert {
  id: number;
  name?: string | null;
  type?: string | null;
  mark?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  updateBy?: string | null;
  score?: number | null;
  count?: number | null;
}

export type NewConvert = Omit<IConvert, 'id'> & { id: null };
