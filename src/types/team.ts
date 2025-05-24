// type Permission = 'Team Management' | 'Product Listing' | 'Tasks and Booth Setup';

// type Status = "Active" | "Inactive" | "Pending";

export type ITeamMember = {
  id: number;
  fullName: string;
  email: string;
  profileUrl: string;
  designation: string;
  country: string;
  phone: string;
  status: string;
  state: string;
  city: string;
  updatedAt: string;
  permissions?: string[];
};

export type ITeamMemberCreate = {
  id?: number;
  exhibitorId: number;
  eventId: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  designation: string;
  country: string;
  state: string;
  city: string;
  phone: string;
  status?: string;
  permissions?: string[];
};

export interface IExhibitorItem {
  id: number;
  eventId: number;
  userCount?: number;
  remainingUserCount?: number;
  companyName: string;
  companyAddress: string;
  gstNo: string;
  panNo: string;
  about: string | null;
  directorName?: string;
  directorProfile?: string | null;
  supportEmail: string;
  supportPhone: string;
  imgUrl: string;
  facebookUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  videos?: any[];
}
