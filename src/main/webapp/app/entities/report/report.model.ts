import dayjs from 'dayjs/esm';

export interface IReport {
  id: number;
  name?: string | null;
  code?: string | null;
  sampleReportId?: number | null;
  testOfObject?: string | null;
  checker?: string | null;
  status?: string | null;
  frequency?: string | null;
  reportType?: string | null;
  reportTypeId?: number | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  scoreScale?: string | null;
  updateBy?: string | null;
  planId?: string | null;
  user?: string | null;
  sampleReport?: string | null;
  detail?: any | null;
}

export type NewReport = Omit<IReport, 'id'> & { id: null };
