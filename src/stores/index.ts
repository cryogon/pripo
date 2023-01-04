import { defineStore } from "pinia";
import { useQuery } from "@vue/apollo-composable";
import { GET_ALL_BLOGS, GET_ALL_USER } from "@/graphql";
export const usePripoStore = defineStore("pripo", {
  state: () => ({
    user: useQuery(GET_ALL_USER),
    blogs: useQuery(GET_ALL_BLOGS),
  }),
});
