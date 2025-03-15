import dayjs from 'dayjs/esm';

export interface ICriteria {
  id: number;
  name?: string | null;
  criterialGroupId?: number | null;
  status?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  updateBy?: string | null;
  criterialGroup?: string | null;
}

export type NewCriteria = Omit<ICriteria, 'id'> & { id: null };
