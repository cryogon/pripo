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
  is_supporter: boolean;
  /**
   *- **default** means that the user profile is visible but private posts are not.
   *- **partial** means that the user profile is visible but follower/followings and posts are not visible.
   *- **none** means that the user profile is not visible
   * @default "default"
   */
  profile_visibility: "default" | "partial" | "none";
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
  root_id: number;
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
  mutate(v: any): void;
  id: number;
}

export interface Chat {
  id: number;
  sender: {
    username: string;
    profile_picture: string;
  };
  receiver: {
    username: string;
    profile_picture: string;
  };
  content: string;
  created_at: Date | number | string;
  is_deleted: boolean;
}
