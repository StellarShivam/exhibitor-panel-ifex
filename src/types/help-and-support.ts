export type ITicketItem = {
  id: number;
  appUserId?: number;
  eventId: number;
  subject: string;
  priority: string;
  status: string;
  assignTo: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  profileUrl?: string;
  eventName?: string;
  createdBy?: string;
};

export type ITicketTableFilterValue = string | string[];

export type ITicketTableFilters = {
  priority: string[];
  status: string;
  name: string;
};

export type ITicketMessage = {
  id: number;
  ticketId: number;
  userType: string;
  message: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
};

export type ITicketDetails = {
  ticket: ITicketItem;
  details: ITicketMessage[];
};

export type ITicketCreateItem = {
  eventId: number;
  subject: string;
  description: string;
  attachments?: string[];
};

export type ITicketMessageItem = {
  eventId: number;
  ticketId: number;
  subject?: string;
  description: string;
  attachments?: string[];
};
