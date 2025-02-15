import dayjs from 'dayjs/esm';

export interface ITitle {
  id: number;
  name?: string | null;
  source?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  dataType?: string | null;
  updateBy?: string | null;
  field?: string | null;
}

export type NewTitle = Omit<ITitle, 'id'> & { id: null };
