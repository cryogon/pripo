import gql from "graphql-tag";

export const INSERT_BLOG = gql`
  mutation addBlog(
    $title: String!
    $content: String!
    $isPublic: Boolean!
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
    blogs(limit: $limit, offset: $offset) {
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
    blogs(where: { id: { _eq: $id } }) {
      id
      title
      content
      date_posted
      is_public
      likes
      tags
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
        children
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
  ) {
    insert_comments(
      objects: {
        blog_id: $blogId
        content: $content
        username: $name
        parent_id: $parent_id
        is_public: $isPublic
      }
    ) {
      returning {
        id
        blog_id
        content
        username
        parent_id
        is_edited
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

export const GET_COMMENTS = gql`
  query getComments($blogId: Int!) {
    comments(
      where: {
        _and: [{ blog_id: { _eq: $blogId } }, { is_deleted: { _eq: false } }]
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
      liked_blogs {
        blog {
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
      blogs(order_by: { id: asc }) {
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
      liked_blogs {
        blog {
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
      blogs(order_by: { id: asc }) {
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
    $isPublic: Boolean!
    $tags: jsonb!
  ) {
    update_blogs(
      _set: {
        title: $title
        content: $content
        is_public: $isPublic
        tags: $tags
      }
      where: { id: { _eq: $blogId } }
    ) {
      returning {
        id
        title
        content
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
        _or: [
          { title: { _ilike: $query } }
          { content: { _ilike: $query } }
          { username: { _ilike: $query } }
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
        _or: [{ name: { _ilike: $query } }, { username: { _ilike: $query } }]
      }
    ) {
      id
      name
      username
      profile_picture
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

export const GET_THREAD_COMMENT = gql`
  query threadComment($id: bigint!) {
    comments(
      order_by: { id: asc }
      where: { _or: [{ id: { _eq: $id } }, { parent_id: { _eq: $id } }] }
    ) {
      blog_id
      id
      parent_id
      content
      posted_on
      likes
      username
      user {
        id
        profile_picture
        username
      }
      liked_users {
        user_id
      }
      blog {
        title
      }
      is_public
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
        }
        followings {
          id
          name
          username
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
    delete_user_notifications(
      where: {
        _and: [
          { notification_by: { _eq: $me } }
          { notification_for: { _eq: $user } }
        ]
      }
    ) {
      affected_rows
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
