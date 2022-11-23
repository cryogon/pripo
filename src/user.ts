//This is temp file just to store temp user data
//and will be deleted as soon as I setup the database

import { usePripoStore } from "./stores";
// import type { Blog } from "./types";

const store = usePripoStore();

export function getUser() {
  const currUser = {
    id: 1,
    name: "Jatin Thakur",
    unique_name: "cryogon",
    pfp: "/mypfp.jpg",
    joined_at: "Sun Oct 28 2022 11:33:38 GMT+0530 (India Standard Time)",
  };

  const blogs = store.blogs.filter((blog) => {
    return blog.user.unique_name == currUser.unique_name;
  });
  return {
    currUser,
    blogs,
  };
}
