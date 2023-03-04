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
  favourites: {
    user_id: number;
  }[];
  shares: number;
  comments_allowed: boolean;
  comments?: Comment[];
}

export interface User {
  id: number;
  name: string;
  username: string;
  profile_picture: string;
  email: string;
  followers: {
    aggregate: {
      count: number;
    };
    nodes: {
      user: User;
    }[];
  };
  followings: {
    aggregate: {
      count: number;
    };
    nodes: {
      user: User;
    }[];
  };
  liked_blogs: Blog[];
  liked_comments: Comment[];
  created_at: Date | string;
}

export interface Comment {
  id: number;
  content: string;
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

export interface ConfirmRequest {
  mutate: (v: any) => void;
  id: number;
}

export interface Chat {
  sender: string;
  receiver: string;
  chat: {
    id: number;
    content: string;
    date: Date | number | string;
    is_deleted: boolean;
  }[];
}
