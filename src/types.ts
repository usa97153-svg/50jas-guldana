export interface Guest {
  id: string;
  fullName: string;
  guestCount: number;
  side?: string;
  wish?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EventSettings {
  motherName: string;
  jubileeAge: number;
  dateStr: string;
  displayDate: string;
  venueName: string;
  venueAddress: string;
  startTime: string;
  mapUrl: string;
}

export interface GuestsApiResponse {
  guests: Guest[];
  totalCount: number;
  responsesCount: number;
}
