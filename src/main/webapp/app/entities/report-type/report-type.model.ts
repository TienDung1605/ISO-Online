import dayjs from 'dayjs/esm';

export interface IReportType {
  id: number;
  code?: string | null;
  name?: string | null;
  status?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  updateBy?: string | null;
}

export type NewReportType = Omit<IReportType, 'id'> & { id: null };
