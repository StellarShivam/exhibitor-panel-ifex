export type ISession = {
  id: number;
  eventId: number | null;
  inviteFrom: string;
  inviteTo: string;
  title: string;
  description: string;
  meetingData: any | null;
  meetingType: string;
  meetingStatus: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
};

export type ITask = {
  id: number;
  adminUserId: number;
  eventId: number;
  taskName: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};
