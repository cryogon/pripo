import gql from "graphql-tag";

export const INSERT_BLOG = gql`
  mutation addBlog(
    $title: String!
    $content: String!
    $isPublic: Boolean!
    $commentAllowed: Boolean!
    $tags: jsonb!
    $username: String!
    $likes: Int!
    $shares: Int
  ) {
    insert_blogs(
      objects: [
        {
          title: $title
          content: $content
          is_public: $isPublic
          tags: $tags
          username: $username
          likes: $likes
          shares: $shares
          comments_allowed: $commentAllowed
        }
      ]
    ) {
      returning {
        id
        title
        content
        is_public
        tags
        username
        likes
        shares
      }
    }
  }
`;

export const GET_ALL_BLOGS = gql`
  query getBlog($limit: Int!, $offset: Int!) {
    blogs(
      limit: $limit
      offset: $offset
      where: { is_deleted: { _eq: false } }
    ) {
      id
      title
      content
      date_posted
      comments {
        blog_id
        id
        parent_id
        content
        posted_on
        likes
        user {
          id
          profile_picture
          username
        }
      }
      is_public
      likes
      tags
      user {
        id
        profile_picture
        username
      }
    }
  }
`;

export const GET_BLOG = gql`
  query getBlog($id: Int) {
    blogs(
      where: { _and: [{ id: { _eq: $id } }, { is_deleted: { _eq: false } }] }
    ) {
      id
      title
      content
      date_posted
      is_public
      likes
      tags
      comments_allowed
      favourites {
        user_id
      }
      user {
        id
        profile_picture
        username
      }
    }
  }
`;

export const POST_COMMENT = gql`
  mutation submitComment(
    $blog_id: Int!
    $content: String
    $username: String
    $is_public: Boolean!
  ) {
    insert_comments(
      objects: {
        blog_id: $blog_id
        content: $content
        username: $username
        is_public: $is_public
      }
    ) {
      returning {
        blog_id
        content
        id
        is_edited
        is_public
        user {
          id
          username
          profile_picture
        }
      }
    }
  }
`;

export const POST_REPLY = gql`
  mutation postReply(
    $blogId: Int!
    $content: String!
    $name: String!
    $parent_id: bigint!
    $isPublic: Boolean!
    $receiver: String!
    $root_id: bigint!
  ) {
    insert_comments(
      objects: {
        blog_id: $blogId
        content: $content
        username: $name
        parent_id: $parent_id
        is_public: $isPublic
        root_id: $root_id
      }
    ) {
      returning {
        id
        blog_id
        content
        username
        parent_id
        is_edited
        root_id
        is_public
        user {
          id
          username
          profile_picture
        }
      }
    }
    insert_user_notifications(
      objects: {
        notification_by: $name
        notification_for: $receiver
        type: "reply"
        blog_id: $blogId
        comment_id: $parent_id
      }
    ) {
      returning {
        id
        has_read
        notification_by
        notification_for
        blog_id
        comment {
          id
          content
        }
      }
    }
  }
`;

export const GET_COMMENTS = (cmntId: number | undefined) =>
  gql`
    query getComments($blogId: Int) {
      comments(
        where: {
          ${
            cmntId
              ? `_or:[{id:{_eq:${cmntId}}},{root_id:{_eq:${cmntId}}}]`
              : "_and: [{ blog_id: { _eq: $blogId } }, { is_deleted: { _eq: false } }]"
          }
        }
        order_by: { id: asc }
      ) {
        blog_id
        id
        parent_id
        content
        posted_on
        likes
        username
        root_id
        user {
          id
          profile_picture
          username
        }
        liked_users {
          user_id
        }
        is_public
      }
    }
  `;

export const GET_USER_BY_ID = gql`
  query getUser($id: Int!) {
    users(where: { id: { _eq: $id } }) {
      id
      name
      username
      profile_picture
      special_title
      created_at
      location
      interests
      cover_picture
      about
      social_links
      chatting_with
      profile_visibility
      liked_blogs {
        blog(where: { is_deleted: { _eq: false } }) {
          id
          title
          favourites: favourites_aggregate {
            aggregate {
              count
            }
          }
          date_posted
          is_public
        }
      }
      blogs(order_by: { id: asc }, where: { is_deleted: { _eq: false } }) {
        id
        title
        favourites: favourites_aggregate {
          aggregate {
            count
          }
        }
        date_posted
        is_public
      }
      followers: followers_aggregate {
        aggregate {
          count
        }
        nodes {
          user: followings {
            profile_picture
            username
            name
            profile_visibility
          }
        }
      }
      followings: followings_aggregate {
        aggregate {
          count
        }
        nodes {
          user: followers {
            profile_picture
            username
            name
            profile_visibility
          }
        }
      }
    }
  }
`;
export const GET_USER_BY_USERNAME = gql`
  query getUser($username: String!) {
    users(where: { username: { _eq: $username } }) {
      id
      name
      username
      profile_picture
      special_title
      created_at
      location
      interests
      cover_picture
      about
      social_links
      chatting_with
      profile_visibility
      liked_blogs {
        blog(where: { is_deleted: { _eq: false } }) {
          id
          title
          favourites: favourites_aggregate {
            aggregate {
              count
            }
          }
          date_posted
          is_public
        }
      }
      blogs(order_by: { id: asc }, where: { is_deleted: { _eq: false } }) {
        id
        title
        favourites: favourites_aggregate {
          aggregate {
            count
          }
        }
        date_posted
        is_public
      }
      followers: followers_aggregate {
        aggregate {
          count
        }
        nodes {
          user: followings {
            profile_picture
            username
            name
            profile_visibility
          }
        }
      }
      followings: followings_aggregate {
        aggregate {
          count
        }
        nodes {
          user: followers {
            profile_picture
            username
            name
            profile_visibility
          }
        }
      }
    }
  }
`;

export const SET_LIKE = gql`
  mutation setLike($blogId: Int!, $userId: Int!) {
    insert_blog_likes(objects: { blog_id: $blogId, user_id: $userId }) {
      returning {
        id
        blog_id
        user_id
      }
    }
    update_blogs(_inc: { likes: 1 }, where: { id: { _eq: $blogId } }) {
      returning {
        id
        likes
        favourites {
          id
          user_id
          users {
            id
            name
            username
          }
        }
      }
    }
  }
`;

export const REMOVE_LIKE = gql`
  mutation removeLike($blogId: Int!, $userId: Int!) {
    delete_blog_likes(
      where: { _and: { blog_id: { _eq: $blogId }, user_id: { _eq: $userId } } }
    ) {
      returning {
        id
        blog_id
        user_id
      }
    }
    update_blogs(_inc: { likes: -1 }, where: { id: { _eq: $blogId } }) {
      returning {
        id
        likes
        favourites {
          id
          user_id
          users {
            id
            name
            username
          }
        }
      }
    }
  }
`;

export const SET_COMMENT_LIKE = gql`
  mutation commentLikes($commentId: bigint!, $userId: Int!) {
    insert_comment_likes(
      objects: { comment_id: $commentId, user_id: $userId }
    ) {
      affected_rows
    }
    update_comments(_inc: { likes: 1 }, where: { id: { _eq: $commentId } }) {
      returning {
        id
        likes
        liked_users {
          id
          user_id
        }
      }
    }
  }
`;

export const REMOVE_COMMENT_LIKE = gql`
  mutation commentLikes($commentId: bigint!, $userId: Int!) {
    delete_comment_likes(
      where: {
        _and: { comment_id: { _eq: $commentId }, user_id: { _eq: $userId } }
      }
    ) {
      affected_rows
    }
    update_comments(_inc: { likes: -1 }, where: { id: { _eq: $commentId } }) {
      returning {
        id
        likes
        liked_users {
          id
          user_id
        }
      }
    }
  }
`;

export const EDIT_COMMENT = gql`
  mutation editComment(
    $commentId: bigint!
    $content: String!
    $isPublic: Boolean!
  ) {
    update_comments(
      _set: { content: $content, is_public: $isPublic, is_edited: true }
      where: { id: { _eq: $commentId } }
    ) {
      returning {
        id
        content
        is_public
        is_edited
      }
    }
  }
`;

export const EDIT_BLOG = gql`
  mutation editBlog(
    $blogId: Int!
    $title: String!
    $content: String!
    $commentAllowed: Boolean!
    $isPublic: Boolean!
    $tags: jsonb!
  ) {
    update_blogs(
      _set: {
        title: $title
        content: $content
        is_public: $isPublic
        comments_allowed: $commentAllowed
        tags: $tags
      }
      where: { id: { _eq: $blogId } }
    ) {
      returning {
        id
        title
        content
        comments_allowed
        is_public
        tags
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($id: bigint!) {
    update_comments(_set: { is_deleted: true }, where: { id: { _eq: $id } }) {
      returning {
        id
        is_deleted
      }
    }
  }
`;

export const LISTEN_NOTIFICATION = gql`
  subscription listenNotification {
    user_notifications(
      order_by: { created_at: desc }
      where: { has_read: { _eq: false } }
      limit: 5
    ) {
      id
      notification_for
      blog {
        id
      }
      sender {
        profile_picture
        username
      }
      comment {
        id
        content
      }
      type
      has_read
      created_at
    }
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation markRead($id: bigint!) {
    update_user_notifications(
      _set: { has_read: true }
      where: { id: { _eq: $id } }
    ) {
      returning {
        id
        has_read
        blog_id
        created_at
        notification_by
        notification_for
        type
      }
    }
  }
`;

export const MARK_ALL_NOTIFICATION_READ = gql`
  mutation markAllRead($username: String!) {
    update_user_notifications(
      _set: { has_read: true }
      where: {
        _and: [
          { notification_for: { _eq: $username } }
          { has_read: { _eq: false } }
        ]
      }
    ) {
      affected_rows
      returning {
        id
        has_read
        blog_id
        created_at
        notification_by
        notification_for
        type
      }
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query getNotifications($user: String!) {
    user_notifications(
      where: { notification_for: { _eq: $user } }
      order_by: { created_at: desc }
    ) {
      id
      sender {
        username
        profile_picture
      }
      comment {
        id
        content
      }
      type
      created_at
      has_read
      blog_id
    }
  }
`;

export const GET_FILTERED_POSTS = gql`
  query getFilteredPosts($query: String!) {
    blogs(
      where: {
        _and: [
          { is_public: { _eq: true } }
          {
            _or: [
              { title: { _ilike: $query } }
              { content: { _ilike: $query } }
              { username: { _ilike: $query } }
            ]
          }
        ]
      }
    ) {
      id
      title
      content
      likes
      user {
        id
      }
      favourites {
        user_id
      }
    }
    users(
      where: {
        _and: [
          {
            _or: [
              { name: { _ilike: $query } }
              { username: { _ilike: $query } }
            ]
          }
          { profile_visibility: { _neq: "hidden" } }
        ]
      }
    ) {
      id
      name
      username
      profile_picture
      location
      followers {
        user: followings {
          username
        }
      }
    }
  }
`;

export const FILTER_BY_TAGS = gql`
  query getFilteredPosts($tags: jsonb!) {
    blogs(where: { tags: { _contains: $tags } }) {
      id
      title
      content
      likes
    }
  }
`;

export const INSERT_NOTIFICATION = gql`
  mutation insertNotification(
    $sender: String!
    $receiver: String!
    $blog_id: Int!
    $comment_id: bigint!
  ) {
    insert_user_notifications(
      objects: {
        notification_by: $sender
        notification_for: $receiver
        type: "comment"
        blog_id: $blog_id
        comment_id: $comment_id
      }
    ) {
      returning {
        id
        has_read
        notification_by
        notification_for
        blog_id
        comment
      }
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation addFollower($me: String!, $user: String!) {
    insert_follow_system(objects: { follows: $user, user: $me }) {
      returning {
        id
        follows
        followers {
          id
          name
          username
          profile_picture
        }
        followings {
          id
          name
          username
          profile_picture
        }
      }
    }
    insert_user_notifications(
      objects: { notification_by: $me, notification_for: $user, type: "follow" }
    ) {
      returning {
        id
        notification_by
        notification_for
      }
    }
  }
`;
export const UNFOLLOW_USER = gql`
  mutation removeFollower($me: String!, $user: String!) {
    delete_follow_system(
      where: { _and: [{ follows: { _eq: $user } }, { user: { _eq: $me } }] }
    ) {
      returning {
        id
        follows
        user
      }
    }
  }
`;
export const GET_FOLLOWER_COUNT = gql`
  query getFollowerCount($user: String) {
    follow_system_aggregate(where: { follows: { _eq: $user } }) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_FOLLOWING_COUNT = gql`
  query getFollowingCount($user: String!) {
    follow_system_aggregate(where: { user: { _eq: $user } }) {
      aggregate {
        count
      }
    }
  }
`;

export const UPDATE_LOCATION = gql`
  mutation updateLocation($loc: String!, $user: String!) {
    update_users(
      _set: { location: $loc }
      where: { username: { _eq: $user } }
    ) {
      returning {
        id
        username
        location
      }
    }
  }
`;

export const UPDATE_INTERESTS = gql`
  mutation setInterests($interests: String!, $user: String!) {
    update_users(
      _set: { interests: $interests }
      where: { username: { _eq: $user } }
    ) {
      returning {
        id
        username
        interests
      }
    }
  }
`;

export const UPDATE_ABOUT = gql`
  mutation updateAbout($user: String!, $content: String!) {
    update_users(
      _set: { about: $content }
      where: { username: { _eq: $user } }
    ) {
      returning {
        id
        username
        about
      }
    }
  }
`;

export const SET_LINKS = gql`
  mutation setLinks($link: jsonb!, $user: String!) {
    update_users(
      _set: { social_links: $link }
      where: { username: { _eq: $user } }
    ) {
      returning {
        id
        username
        social_links
      }
    }
  }
`;

export const GET_CHAT = gql`
  query chat($user: String!, $receiver: String!) {
    user_chats(
      where: {
        _and: [{ sender: { _eq: $user } }, { receiver: { _eq: $receiver } }]
      }
    ) {
      id
      sender
      receiver
    }
  }
`;
export const GET_CHAT_ALL = gql`
  query chat($user: String!) {
    users(where: { username: { _eq: $user } }) {
      id
      chatting_with
    }
  }
`;

export const LISTEN_CHAT_CONTENT = gql`
  subscription chat($user: String!, $receiver: String!) {
    user_chats(
      where: {
        _or: [
          { sender: { _eq: $user }, receiver: { _eq: $receiver } }
          { sender: { _eq: $receiver }, receiver: { _eq: $user } }
        ]
      }
    ) {
      id
      content
      sender: chat_by {
        username
        profile_picture
      }
      is_deleted
      created_at
      receiver: chat_with {
        username
        profile_picture
      }
    }
  }
`;
export const INITIALIZE_CHAT = gql`
  mutation setChat(
    $user1: String!
    $receiver1: jsonb!
    $user2: String!
    $receiver2: jsonb!
  ) {
    u1: update_users(
      _append: { chatting_with: $receiver1 }
      where: { username: { _eq: $user1 } }
    ) {
      returning {
        id
        username
        chatting_with
      }
    }
    u2: update_users(
      _append: { chatting_with: $receiver2 }
      where: { username: { _eq: $user2 } }
    ) {
      returning {
        id
        username
        chatting_with
      }
    }
  }
`;

export const ADD_CHAT = gql`
  mutation addChat($user: String!, $receiver: String!, $content: String!) {
    insert_user_chats(
      objects: { sender: $user, receiver: $receiver, content: $content }
    ) {
      returning {
        id
        sender
        receiver
        content
      }
    }
  }
`;

export const TEMP_USER = gql`
  query getTempUser($user: String!) {
    users(where: { username: { _eq: $user } }) {
      username
      profile_picture
    }
  }
`;

export const UPDATE_PROFILE_VISIBILITY = gql`
  mutation updateProfileVisibility($user: String!, $visibility: String!) {
    update_users(
      _set: { profile_visibility: $visibility }
      where: { username: { _eq: $user } }
    ) {
      returning {
        id
        username
        profile_visibility
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation deleteBlog($id: Int!) {
    update_blogs(_set: { is_deleted: true }, where: { id: { _eq: $id } }) {
      returning {
        id
        is_deleted
      }
    }
  }
`;
