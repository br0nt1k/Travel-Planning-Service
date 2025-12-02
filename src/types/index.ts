export interface ITrip {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  collaborators: string[];
  createdAt?: string;
}

export interface IPlace {
  id: string;
  tripId: string;
  locationName: string;
  notes?: string;
  dayNumber: number;
  isVisited: boolean;
}

export interface IUserProfile {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

export interface IInvitation {
  id: string;
  tripId: string;
  tripTitle: string;
  senderEmail: string;
  receiverUid: string;
  status: 'pending';
  createdAt: string;
}