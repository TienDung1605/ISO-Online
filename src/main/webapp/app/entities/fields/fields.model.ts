import dayjs from 'dayjs/esm';

export interface IFields {
  id: number;
  name?: string | null;
  fieldName?: string | null;
  sourceId?: number | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  createBy?: string | null;
  source?: string | null;
}

export type NewFields = Omit<IFields, 'id'> & { id: null };
