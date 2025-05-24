export type IInvitationCoupons = {
  id: number;
  eventId: number;
  exhibitorId: number;
  userName: string | null;
  couponCode: string;
  email: string | null;
  companyName: string | null;
  phone: string | null;
};
