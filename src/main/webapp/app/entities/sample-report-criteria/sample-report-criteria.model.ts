import dayjs from 'dayjs/esm';

export interface ISampleReportCriteria {
  id: number;
  criteriaName?: string | null;
  criteriaGroupName?: string | null;
  criteriaId?: number | null;
  criteriaGroupId?: number | null;
  status?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  updateBy?: string | null;
  frequency?: string | null;
  sampleReportId?: number | null;
  detail?: string | null;
}

export type NewSampleReportCriteria = Omit<ISampleReportCriteria, 'id'> & { id: null };
