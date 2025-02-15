import dayjs from 'dayjs/esm';

export interface ICheckerGroup {
  id: number;
  name?: string | null;
  status?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  updateBy?: string | null;
}

export type NewCheckerGroup = Omit<ICheckerGroup, 'id'> & { id: null };
