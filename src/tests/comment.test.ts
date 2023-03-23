import type { Comment } from "@/types";
import { CommentBuilder } from "@/composables/CommentBuilder";
import { describe, test, expect } from "vitest";

describe("CommentBuilder", () => {
  describe("addMultiple", () => {
    test("should build a tree of comments with correct parent-child relationships", () => {
      const comments: Comment[] = [
        {
          id: 1,
          content: "Comment 1",
          parent_id: null,
          posted_on: "2022-01-01",
          blog_id: 1,
          likes: 0,
          root_id: 1,
          is_public: true,
          user: { id: 1, profile_picture: "user1.png", username: "user1" },
          liked_users: [],
          blog: {
            title: "Blog 1",
          },
        },
        {
          id: 2,
          content: "Comment 2",
          parent_id: 1,
          posted_on: "2022-01-02",
          blog_id: 1,
          likes: 0,
          root_id: 1,
          is_public: true,
          user: {
            id: 2,
            profile_picture: "user2.png",
            username: "user2",
          },
          liked_users: [],
          blog: {
            title: "Blog 1",
          },
        },
        {
          id: 3,
          content: "Comment 3",
          parent_id: 1,
          posted_on: "2022-01-03",
          blog_id: 1,
          likes: 0,
          root_id: 1,
          is_public: true,
          user: {
            id: 3,
            profile_picture: "user3.png",
            username: "user3",
          },
          liked_users: [],
          blog: {
            title: "Blog 1",
          },
        },
        {
          id: 4,
          content: "Comment 4",
          parent_id: 3,
          posted_on: "2022-01-04",
          blog_id: 1,
          likes: 0,
          root_id: 1,
          is_public: true,
          user: {
            id: 4,
            profile_picture: "user4.png",
            username: "user4",
          },
          liked_users: [],
          blog: {
            title: "Blog 1",
          },
        },
      ];

      const builder = new CommentBuilder();
      builder.addMultiple(comments);

      const tree = builder.root;
      expect(tree.children.length).toBe(1);
      expect(tree.children[0].children.length).toBe(2);
      expect(tree.children[0].children[1].children.length).toBe(1);
    });
  });
});
