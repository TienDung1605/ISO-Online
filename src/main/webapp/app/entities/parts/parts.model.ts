import dayjs from 'dayjs/esm';

export interface IParts {
  id: number;
  name?: string | null;
  status?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  updateBy?: string | null;
}

export type NewParts = Omit<IParts, 'id'> & { id: null };
