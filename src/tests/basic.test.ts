//Add More Test Later On
import { CommentBuilder } from "@/composables/CommentBuilder";
import { describe, test, expect } from "vitest";
describe("#CommentBuilder", () => {
  test("Create an object", () => {
    expect(new CommentBuilder()).toBeInstanceOf(CommentBuilder);
  });
});
