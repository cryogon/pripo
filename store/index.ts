import { defineStore } from "pinia";

export const usePripoStore = defineStore("pripo", {
  state: () => ({
    blogs: [
      {
        id: 1,
        user: "Jatin Thakur",
        userPfp: "/mypfp.jpg",
        tags: ["Story", "Daily"],
        title: "This is placeholder title",
        content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Consequuntur veniam fugiat velit inventore perspiciatis fuga numquam
         rerum cupiditate impedit magni id, ex voluptatum nam qui, tempore tenetur at odio enim minima? 
         Pariatur consequuntur optio quam aspernatur repudiandae nihil dicta corporis vero, atque, est magnam dignissimos 
         ratione reprehenderit ipsum eum mollitia et, molestiae nesciunt. Voluptate consectetur consequuntur, dolorem 
         excepturi earum voluptates! Laborum sit modi eum culpa. Nobis atque deleniti corporis dolor, id iure libero perferendis
          quasi asperiores numquam. Voluptas voluptates dolorum assumenda quae animi non corporis voluptatem nesciunt ad commodi deserunt 
          consequatur dignissimos, quibusdam, adipisci exercitationem impedit, quod obcaecati dolore explicabo veritatis distinctio repellendus 
          officiis delectus. Culpa atque voluptate facere, excepturi enim cupiditate.`,
        isPublic: true,
        date_posted: "yesterday",
        comment:{
          userPfp:"/mypfp.jpg",
          username:"cryogon",
          content:"Nice Story Dude",
        }
      },
      {
        id: 2,
        user: "Jay Thakur",
        userPfp: "/mypfp.jpg",
        tags: ["Story", "Daily"],
        title: "This is placeholder title",
        content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Consequuntur veniam fugiat velit inventore perspiciatis fuga numquam
         rerum cupiditate impedit magni id, ex voluptatum nam qui, tempore tenetur at odio enim minima? 
         Pariatur consequuntur optio quam aspernatur repudiandae nihil dicta corporis vero, atque, est magnam dignissimos 
         ratione reprehenderit ipsum eum mollitia et, molestiae nesciunt. Voluptate consectetur consequuntur, dolorem 
         excepturi earum voluptates! Laborum sit modi eum culpa. Nobis atque deleniti corporis dolor, id iure libero perferendis
          quasi asperiores numquam. Voluptas voluptates dolorum assumenda quae animi non corporis voluptatem nesciunt ad commodi deserunt 
          consequatur dignissimos, quibusdam, adipisci exercitationem impedit, quod obcaecati dolore explicabo veritatis distinctio repellendus 
          officiis delectus. Culpa atque voluptate facere, excepturi enim cupiditate.`,
        isPublic: false,
        date_posted: "2 days ago",
      },
      {
        id: 3,
        user: "Aditya Thakur",
        userPfp: "/mypfp.jpg",
        tags: ["Story", "Daily"],
        title: "This is placeholder title",
        content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Consequuntur veniam fugiat velit inventore perspiciatis fuga numquam
         rerum cupiditate impedit magni id, ex voluptatum nam qui, tempore tenetur at odio enim minima? 
         Pariatur consequuntur optio quam aspernatur repudiandae nihil dicta corporis vero, atque, est magnam dignissimos 
         ratione reprehenderit ipsum eum mollitia et, molestiae nesciunt. Voluptate consectetur consequuntur, dolorem 
         excepturi earum voluptates! Laborum sit modi eum culpa. Nobis atque deleniti corporis dolor, id iure libero perferendis
          quasi asperiores numquam. Voluptas voluptates dolorum assumenda quae animi non corporis voluptatem nesciunt ad commodi deserunt 
          consequatur dignissimos, quibusdam, adipisci exercitationem impedit, quod obcaecati dolore explicabo veritatis distinctio repellendus 
          officiis delectus. Culpa atque voluptate facere, excepturi enim cupiditate.`,
        isPublic: false,
        date_posted: "3 days ago",
      },
    ] as blogType[],
  }),
});

interface blogType {
  id: number;
  user: string;
  userPfp: string;
  tags: string[];
  title: string;
  content: string;
  isPublic: boolean;
  date_posted: string;
  comment:{
    userPfp:string;
    username:string;
    content:string;
  }
}
