import { Meta } from './meta.entity';

export class Provider {
  name?: string;
  id?: string;
}

export class User {
  id: string;
  name?: string;
  phone: string;
  email?: string;
  avatar?: string;
  provider?: Provider;
  is_verified: boolean;
  is_banned: boolean;
  role: string;
  
  created_at: Date;
  updated_at: Date;
}

export class GetUsers {
  results?: User[];
  meta?: Meta;
}
