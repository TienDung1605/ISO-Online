import dayjs from 'dayjs/esm';

export interface IFields {
  id: number;
  name?: string | null;
  fieldName?: string | null;
  sourceId?: number | null;
  createdAt?: any | null;
  updatedAt?: any | null;
  createBy?: string | null;
  source?: string | null;
}

export type NewFields = Omit<IFields, 'id'> & { id: null };
