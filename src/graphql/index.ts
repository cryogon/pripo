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
