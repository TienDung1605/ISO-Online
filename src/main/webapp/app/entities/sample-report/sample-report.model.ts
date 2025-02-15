import dayjs from 'dayjs/esm';

export interface ISampleReport {
  id: number;
  name?: string | null;
  status?: number | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  updateBy?: string | null;
  frequency?: string | null;
  code?: string | null;
  reportType?: string | null;
  reportTypeId?: number | null;
}

export type NewSampleReport = Omit<ISampleReport, 'id'> & { id: null };
