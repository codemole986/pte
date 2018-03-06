import { User } from './user'

export class Userprofile extends User {
  user_id: number;
  username: string;
  photo: string;
  phone: string;
  interest: string;
  occupation: string;
  summary: string;
  website_url: string;

  id: number;
    first_name: string;
    last_name: string;
    address: string;
    email: string;
    oldpassword: string;
    password: string;
    confirmpassword: string;
    permission: string;
    class: any;
    remember: boolean;
    visited_count: number;
}
