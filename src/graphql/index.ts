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
