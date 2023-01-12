export class Tree {
  root: Comment | null = null;
  parents: Comment[] = [];
  constructor(comments?: Comment[]) {
    if (!comments) {
      this.root = null;
    } else {
      comments.forEach((c) => this.add(c));
    }
  }
  traverse(callback: any) {
    function walk(node: Comment | null) {
      callback(node);
      node && (node.childrens || []).forEach(walk);
    }
    walk(this.root);
  }

  add(comment: Comment) {
    const newNode = comment;
    if (this.root === null) {
      this.root = comment;
      return;
    }
    this.traverse((node: Comment) => {
      if (node.id === comment.parent_id) {
        if (node.childrens) node.childrens.push(newNode as any);
        else node.childrens = [newNode];
      }
      {
        this.parents.push(newNode);
      }
    });
  }
  nodes() {
    if (this.parents) return this.parents;
  }
  getParents(mutate: any, variables: any) {
    return mutate(variables).then(
      (result: any) => result?.data.insert_comments.returning
    );
  }
}

export interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    profile_picture: string;
    username: string;
  };
  parent_id: number | null;
  likes: number;
  blog_id: number;
  childrens?: Comment[];
}
