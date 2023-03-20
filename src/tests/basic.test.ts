//Add More Test Later On
import { CommentBuilder } from "@/composables/CommentBuilder";
import { setMeta } from "@/helper";
import { describe, test, expect } from "vitest";
describe("#CommentBuilder", () => {
  test("Create an object", () => {
    expect(new CommentBuilder()).toBeInstanceOf(CommentBuilder);
  });
});

describe("setMetaCheck", () => {
  test("Set Page Icon", () => {
    expect(setMeta({ icon: "/icons/notification-icon.png", title: "Test" }));
  });
});
