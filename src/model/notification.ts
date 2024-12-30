import type { User } from '@/model/user';
import type { Document } from '@/model/document';

export interface Notification {
  nId: number;
  message: string;
  timestamp: Date;
  read: boolean;
  recipient: User | null;
  document: Document;
}
