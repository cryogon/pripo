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
    let i = 0;
    function walk(node: Comment | null) {
      callback(node, i++);
      node?.children && node.children.forEach(walk);
    }
    walk(this.root);
  }

  add({ id, content, posted_on, blog_id, likes, parent_id, user }: Comment) {
    const newNode = {
      id,
      content,
      parent_id,
      posted_on,
      likes,
      user,
      blog_id,
      children: [],
    };

    this.traverse((node: any) => {
      if (node.id === parent_id) {
        node.children.push(newNode);
      }
    });
  }
  addMultiple(arr: Comment[] | any) {
    const sortedComments = [...arr];
    sortedComments.sort((a, b) => a.parent_id - b.parent_id);
    sortedComments.forEach((c) => {
      this.add(c);
    });
  }
}

interface Comment {
  id: number | null;
  content: string | null;
  parent_id: number | null;
  posted_on: string;
  blog_id: number;
  likes: number;
  user: {
    id: number;
    profile_picture: string;
    username: string;
  };
  children?: Comment[];
}
