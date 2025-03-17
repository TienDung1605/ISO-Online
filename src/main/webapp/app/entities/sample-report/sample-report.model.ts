import dayjs from 'dayjs/esm';

export interface ISampleReport {
  id: number;
  name?: string | null;
  status?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  updateBy?: string | null;
  frequency?: string | null;
  code?: string | null;
  reportType?: string | null;
  reportTypeId?: number | null;
  detail?: string | null;
}

export type NewSampleReport = Omit<ISampleReport, 'id'> & { id: null };
