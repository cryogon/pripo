import gql from "graphql-tag";

export const INSERT_BLOG = gql`
  mutation addBlog(
    $title: String!
    $content: String!
    $isPublic: Boolean!
    $tags: json!
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
      affected_rows
    }
  }
`;

export const GET_ALL_BLOGS = gql`
  query getBlog {
    blogs {
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
    $blog_id: Int
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
        liked_users {
          id
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
    $parent_id: Int!
    $isPublic: Boolean!
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
      affected_rows
    }
  }
`;

export const GET_COMMENTS = gql`
  query getComments($blogId: Int!) {
    comments(order_by: { id: asc }, where: { blog_id: { _eq: $blogId } }) {
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
  query getUser($id: bigint!) {
    users(where: { id: { _eq: $id } }) {
      id
      name
      username
      profile_picture
      liked_blogs {
        blog {
          id
          title
        }
      }
      blogs {
        id
        title
        content
        is_public
      }
      created_at
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
      liked_blogs {
        blog {
          id
          title
        }
      }
      blogs {
        id
        title
        content
        is_public
      }
      created_at
    }
  }
`;

export const SET_LIKE = gql`
  mutation setLike($blogId: Int!, $userId: Int!) {
    insert_blog_likes(objects: { blog_id: $blogId, user_id: $userId }) {
      affected_rows
    }
    update_blogs(_inc: { likes: 1 }, where: { id: { _eq: $blogId } }) {
      affected_rows
    }
  }
`;

export const REMOVE_LIKE = gql`
  mutation removeLike($blogId: Int!, $userId: Int!) {
    delete_blog_likes(
      where: { _and: { blog_id: { _eq: $blogId }, user_id: { _eq: $userId } } }
    ) {
      affected_rows
    }
    update_blogs(_inc: { likes: -1 }, where: { id: { _eq: $blogId } }) {
      affected_rows
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
      affected_rows
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
      affected_rows
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
      affected_rows
    }
  }
`;

export const EDIT_BLOG = gql`
  mutation editBlog(
    $blogId: Int!
    $title: String!
    $content: String!
    $isPublic: Boolean!
    $tags: json!
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
      affected_rows
    }
  }
`;
