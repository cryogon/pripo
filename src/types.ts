export interface Blog {
  id: number;
  user: User | any;
  tags: string[];
  title: string;
  content: string;
  isPublic: boolean;
  date_posted: Date | string;
  likes: number;
  shares: number;
  comments?: Comment[];
}

export interface User {
  id: number;
  name: string;
  unique_name: string;
  pfp: string;
  joined_at: Date | string;
}

export interface Comment {
  id: number;
  user: User;
  content: string;
  postedOn: Date;
  likes: Likes;
  reply?: Comment[];
}
export interface Likes {
  count: number;
  users: User[];
}
