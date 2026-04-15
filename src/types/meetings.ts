export interface ISlot {
  slotId: number;
  startTime: string;
  endTime: string;
}

export interface IMember {
  name: string;
  designation: string;
  email: string;
}

export interface IBookMeeting {
  eventId: number;
  slotId: number;
  title: string;
  email: string;
  location: string;
}

export interface ISchedule {
  agendaId: number;
  title: string;
  startDate: string;
  endDate: string;
  sessionType: string;
  location: string;
}

export interface IBookedSlot {
  slotId: number;
  country: string;
  inviteToEventMemberId: number;
  productCategory: string;
  startTime: string;
  endTime: string;
  inviteFromEmail: string;
  inviteFromName: string;
  inviteToName: string;
  inviteToEmail: string;
  fromCompanyName: string;
  toCompanyName: string;
  meetingTitle: string;
  meetingId: number;
  meetingStatus: string;
  meetingLocation: string;
}

export interface IAllUserSlots {
  bookedSlots: IBookedSlot[];
  schedules: ISchedule[];
  availableSlots: ISlot[];
  unavailableSlots: ISlot[];
}

export interface IUpdateMeetingStatus {
  meetingId: number;
  status: string;
}

export interface IRescheduleMeeting {
  meetingId: number;
  slotId: number;
  title: string;
  // email: string;
  location: string;
}
