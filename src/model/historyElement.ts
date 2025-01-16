import type { User } from '@/model/user';
import type { Document } from '@/model/document';

export interface HistoryElement {
  histId: number;
  timestamp: Date;
  document: Document;
  user?: User;
}
