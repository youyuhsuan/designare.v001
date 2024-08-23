import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl?: string | null;
}

export interface Token {
  id: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  lastUsedAt?: Timestamp;
}

export interface UserTokenData {
  user: User;
  token: Token;
}
