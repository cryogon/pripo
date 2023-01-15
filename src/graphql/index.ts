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
    $likedUser: json!
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
          liked_users: $likedUser
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
      liked_users
      user {
        id
        profile_picture
        username
      }
    }
  }
`;

export const GET_ALL_USER = gql`
  query getUser {
    users {
      id
      name
      username
      profile_picture
      blogs {
        id
        title
        content
      }
      created_at
    }
  }
`;

export const POST_COMMENT = gql`
  mutation submitComment($blogId: Int, $content: String, $name: String) {
    insert_comments(
      objects: { blog_id: $blogId, content: $content, username: $name }
    ) {
      affected_rows
    }
  }
`;

export const POST_REPLY = gql`
  mutation postReply(
    $blogId: Int!
    $content: String!
    $name: String!
    $parent_id: Int!
  ) {
    insert_comments(
      objects: {
        blog_id: $blogId
        content: $content
        username: $name
        parent_id: $parent_id
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
    }
  }
`;

export const GET_USER = gql`
  query getUser($id: bigint!) {
    users(where: { id: { _eq: $id } }) {
      id
      name
      username
      profile_picture
      blogs {
        id
        title
        content
      }
      created_at
    }
  }
`;

export const SET_LIKE = gql`
  mutation setLike(
    $blogId: Int!
    $userId: bigint!
    $blog: jsonb!
    $user: jsonb
  ) {
    update_users(
      _append: { favorite_blogs: $blog }
      where: { id: { _eq: $userId } }
    ) {
      affected_rows
    }
    update_blogs(
      _inc: { likes: 1 }
      _append: { liked_users: $user }
      where: { id: { _eq: $blogId } }
    ) {
      affected_rows
    }
  }
`;
