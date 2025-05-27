export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'creator' | 'brand';
  profile?: {
    profileImageUrl?: string;
    bio?: string;
    location?: string;
    specialties?: string[];
    socialMedia?: {
      instagram?: string;
      tiktok?: string;
      youtube?: string;
    }
  };
  company?: {
    name?: string;
    website?: string;
    industry?: string;
  };
}

export interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
  readBy: string[];
  matchId: string;
}

export interface Match {
  _id: string;
  creator: User;
  brand: User;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
}