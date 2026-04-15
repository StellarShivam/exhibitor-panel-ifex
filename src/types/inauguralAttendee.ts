export interface ICheckAttendee {
  eventId: number;
  phone?: string;
  email?: string;
}

export interface ICreateAttendee {
  exhibitorId: number;
  email: string;
  phone: string;
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  designation: string;
  gender: string;
  documents: any;
  status: string;
}

export interface IAttendee {
  id: number;
  exhibitorId: number;
  eventId: number;
  urnNo: string;
  email: string;
  phone: string;
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  designation: string;
  gender: string;
  documents: any;
  status: string;
  deleted: boolean;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}
