export type IEventItem = {
  exhibitorUserId: number;
  eventName: string;
  exhibitorId: number;
  eventId: number;
  location: string;
  eventLogo: string;
  startDate: string;
  endDate: string;
  fullName: string;
  mobile: string;
};

// Event list model of event list page
export type IEventListItem = {
  eventId: number;
  eventName: string;
  address: string;
  status: string;
  startDate: string;
  endDate: string | null;
  logoUrl: string | null;
};

export type IEventTableFilterValue = string | string[];

export type IEventTableFilters = {
  status: string[];
};

export type IEventAbout = {
  id: number; // event id
  name: string;
  code: string;
  description: string;
  sectorOverview: string;
  keyObjectives: string;
};

export type IEventFAQ = {
  id?: number;
  eventId: number; // event id
  question: string;
  answer: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type IEventSpeaker = {
  id?: number;
  firstName: string;
  lastName: string;
  photo: string;
  email: string;
  phone: string;
  phoneAlt: string;
  company: string;
  title: string;
  subtitle: string;
  isGovernmentOfficial: boolean;
  isIndustryExpert: boolean;
  linkedinLink?: string;
  twitterLink?: string;
  facebookLink?: string;
  instagramLink?: string;
  youtubeLink?: string;
  website?: string;
  about: string;
  eventId: number;
};

export type IEventSchedule = {
  id: number;
  event: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  sessionType: string;
  location: string;
  // sequence_no: number;
  speakers: number[];
  // // is_active: boolean;
  // created_at: string;
  // updated_at: string;
  photo: string;
};

export type IEventMedia = {
  id?: number;
  eventId: number;
  file?: string;
  fileText?: string; // link for VR, AR, etc.
  kind: 'URL' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'PDF' | 'DOC' | 'EXCEL' | 'OTHER';
  category:
    | 'EVENT_LOGO'
    | 'EVENT_HERO_BANNER_IMG'
    | 'EVENT_HERO_BANNER_VIDEO'
    | 'EVENT_BANNER_IMG'
    | 'EVENT_BANNER_VIDEO'
    | 'EVENT_AGENDA_IMG'
    | 'EVENT_AGENDA_VIDEO'
    | 'EVENT_GALLERY_IMG'
    | 'EVENT_GALLERY_VIDEO'
    | 'EVENT_MAP_IMG'
    | 'EVENT_AGENDA_MAP_IMG'
    | 'EVENT_AUDIO'
    | 'EVENT_SPONSOR'
    | 'EVENT_PARTNER'
    | 'EVENT_SPEAKER'
    | 'EVENT_ATTENDEE'
    | 'EVENT_MEDIA'
    | 'EVENT_PRESENTATION'
    | 'EVENT_DOCUMENT'
    | 'EVENT_BROCHURE'
    | 'EVENT_REPORT'
    | 'EVENT_HERO_ASSOCIATED_PARTNER_IMG'
    | 'EVENT_HERO_CENTER_IMAGE'
    | 'EVENT_ABOUT_BANNER_IMG'
    | 'EVENT_EXHIBITOR_IMG'
    | 'EVENT_DOWNLOAD_ASSETS'
    | 'EVENT_META_IMAGE'
    | 'EVENT_FLOOR_MAP'
    | 'EVENT_OTHER';
  title?: string;
  subtitle?: string;
  caption?: string;
  description?: string;
};

// export interface ICurrentEventForm {
//   id: number;
//   event: number;
//   user_cohort: string;
//   is_required: boolean;
//   sequence_no: number;
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
//   name: string;
//   kind: string;
//   label: string;
//   placeholder: string;
//   help_text: string;
//   default_value: IDefaultValue;
//   section_header: string;
//   form_element_id: number;
// }

export interface ICurrentEventForm {
  id: number;
  eventId: number; // updated from "event" to match API response
  userCohort: string; // updated from "user_cohort" to match camelCase convention
  isRequired: boolean; // updated from "is_required" to match camelCase convention
  sequenceNo: number; // updated from "sequence_no" to match camelCase convention
  isActive: boolean; // updated from "is_active" to match camelCase convention
  createdAt: string; // updated from "created_at" to match camelCase convention
  updatedAt: string; // updated from "updated_at" to match camelCase convention
  name: string;
  kind: string;
  label: string;
  placeholder: string;
  helpText: string; // updated from "help_text" to match camelCase convention
  defaultValue: IDefaultValue; // updated from "default_value" to match camelCase convention
  sectionHeader: string; // updated from "section_header" to match camelCase convention
  formElementId: number; // updated from "form_element_id" to match camelCase convention
}

export interface IDefaultValue {
  label?: string;
  value?: string;
}

// export interface IDefaultValue {
//   values?: string[];
// }

export interface IRegisterProps {
  currentEventForm: ICurrentEventForm[];
  eventId: number;
}

export type IEventTab =
  | 'DETAILS'
  | 'TEMPLATE'
  | 'ABOUT'
  | 'SPEAKER_SCHEDULE'
  | 'FLOOR_PLAN'
  | 'REGISTRATION'
  | 'FAQ'
  | 'MEDIA'
  | 'PRICING';

export type IEventTypes = {
  id: number;
  name: string;
  description: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy: number;
};

export type IEventGridFilters = {
  status: string;
  kind: string;
  searchTerm: string;
  startDate: string;
  endDate: string;
};

export type IEventStepTab = {
  id: number;
  stepName: string;
  stepNumber: number;
  eventTypeId: number;
  isMandatory: boolean;
};
