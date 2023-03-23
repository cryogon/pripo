import type { Comment } from "@/types";

export class CommentBuilder {
  root: any;
  constructor() {
    this.root = {
      id: null,
      content: null,
      parent_id: null,
      children: [],
    };
  }

  traverse(callback: any) {
    function walk(node: Comment | null) {
      callback(node);
      node?.children && node.children.forEach(walk);
    }
    walk(this.root);
  }

  add(comment: Comment) {
    const newNode = {
      ...comment,
      children: [],
    };

    if (!this.root.children.length && comment.parent_id != null) {
      this.root = {
        id: null,
        content: null,
        parent_id: null,
        children: [newNode],
      };
      return;
    }

    this.traverse((node: any) => {
      if (node.id === comment.parent_id) {
        node.children.push(newNode);
        return;
      }
    });
  }
  addMultiple(arr: Comment[] | any) {
    const sortedComments = [...arr];
    sortedComments.sort((a, b) => a.parent_id - b.parent_id);
    if (
      sortedComments[0].parent_id !== null &&
      this.root.children.length != 0
    ) {
      this.root = sortedComments[0];
      return;
    }
    sortedComments.forEach((c) => {
      this.add(c);
    });
  }
  clear() {
    this.root = {
      id: null,
      content: null,
      parent_id: null,
      children: [],
    };
  }
  returnJsx(callback: any) {
    const arr = [] as any;
    function walk(node: Comment | null) {
      callback(node);
      node?.children && node.children.forEach(walk);
      arr.push(node);
    }
    walk(this.root);
    return arr;
  }
}
