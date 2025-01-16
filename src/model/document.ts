import type { User } from '@/model/user'

export interface Document {
  readonly docId: number
  name: string
  path?: string
  docType?: string
  content: string
  docDate: string
  owner?: User
}
