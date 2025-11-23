import { Meta } from './meta.model'

export class Provider {
  name?: string
  id?: string
}

export class User {
  id: string
  name?: string
  phone: string
  email?: string
  avatar?: string
  provider?: Provider
  isVerified: boolean
  isBanned: boolean
  role: string
  created_at: Date
  updated_at: Date
}

export class GetUsers {
  results?: User[]
  meta?: Meta
}
