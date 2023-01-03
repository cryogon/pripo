export class Tree {
  root: Comment | null;
  constructor() {
    this.root = null;
  }
  traverse(callback: any) {
    function walk(node: Comment | null) {
      callback(node);
      node && node.childrens.forEach(walk);
    }
    walk(this.root);
  }

  add(comment: Comment) {
    const newNode = comment;

    if (this.root === null) {
      this.root = comment;
    }
    this.traverse((node: Comment) => {
      if (node.id === comment.parentId) {
        node.childrens.push(newNode);
      }
    });
  }
}

export interface Comment {
  id: number;
  content: string;
  parentId: number | null;
  likes: number;
  shares: number;
  blogId: number;
  childrens: Comment[];
}
