import dayjs from 'dayjs/esm';

export interface IInspectionReportTitles {
  id: number;
  nameTitle?: string | null;
  source?: string | null;
  field?: string | null;
  dataType?: string | null;
  timeCreate?: dayjs.Dayjs | null;
  timeUpdate?: dayjs.Dayjs | null;
  sampleReportId?: number | null;
}

export type NewInspectionReportTitles = Omit<IInspectionReportTitles, 'id'> & { id: null };
