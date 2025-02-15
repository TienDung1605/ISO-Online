import dayjs from 'dayjs/esm';

export interface IReportCriteria {
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
  reportId?: number | null;
}

export type NewReportCriteria = Omit<IReportCriteria, 'id'> & { id: null };
