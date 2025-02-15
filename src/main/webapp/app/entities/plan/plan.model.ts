import dayjs from 'dayjs/esm';

export interface IPlan {
  id: number;
  code?: string | null;
  name?: string | null;
  subjectOfAssetmentPlan?: string | null;
  frequency?: string | null;
  timeStart?: dayjs.Dayjs | null;
  timeEnd?: dayjs.Dayjs | null;
  statusPlan?: string | null;
  testObject?: string | null;
  reportTypeId?: number | null;
  reportTypeName?: string | null;
  numberOfCheck?: string | null;
  implementer?: string | null;
  paticipant?: string | null;
  checkerGroup?: string | null;
  checkerName?: string | null;
  checkerGroupId?: number | null;
  checkerId?: number | null;
  gross?: string | null;
  timeCheck?: string | null;
  nameResult?: string | null;
  scriptId?: number | null;
  createBy?: string | null;
  status?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  updateBy?: string | null;
}

export type NewPlan = Omit<IPlan, 'id'> & { id: null };
