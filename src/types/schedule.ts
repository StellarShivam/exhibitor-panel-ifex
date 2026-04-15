// ----------------------------------------------------------------------

export type IScheduleTableFilterValue = string | Date | null;

export type IScheduleTableFilters = {
  name: string;
  country: string;
  status: string;
  meetingDate: string;
};

// ----------------------------------------------------------------------

export type IScheduleItem = {
  id: string;
  companyName: string;
  exhibitorName: string;
  boothNo: string;
  country: string;
  meetingDate: string;
  meetingTime: string;
  status: string;
};

export type ISchedule = {
  id: string;
  companyName: string;
  exhibitorName: string;
  boothNo: string;
  country: string;
  meetingDate: string;
  meetingTime: string;
  status: string;
};
