export interface Blog {
  id: number;
  user: {
    id: number;
    profile_picture: string;
    username: string;
  };
  tags: string[];
  title: string;
  content: string;
  is_public: boolean;
  date_posted: Date | string;
  likes: number;
  shares: number;
  comments?: Comment[];
}

export interface User {
  id: number;
  name: string;
  username: string;
  profile_picture: string;
  email: string;
  liked_blogs: Blog[];
  liked_comments: Comment[];
  created_at: Date | string;
}

export interface Comment {
  id: number | null;
  content: string | null;
  parent_id: number | null;
  posted_on: string;
  blog_id: number;
  likes: number;
  is_public: boolean;
  user: {
    id: number;
    profile_picture: string;
    username: string;
  };
  liked_users: {
    user_id: number;
  }[];
  blog: {
    title: string;
  };
  children?: Comment[];
}
