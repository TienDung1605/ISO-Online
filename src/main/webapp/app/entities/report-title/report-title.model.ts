import dayjs from 'dayjs/esm';

export interface IReportTitle {
  id: number;
  name?: string | null;
  source?: string | null;
  field?: string | null;
  dataType?: string | null;
  index?: number | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  updateBy?: string | null;
  reportId?: number | null;
}

export type NewReportTitle = Omit<IReportTitle, 'id'> & { id: null };
