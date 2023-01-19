import { defineStore } from "pinia";
import { useQuery } from "@vue/apollo-composable";
import { GET_ALL_BLOGS } from "@/graphql";
export const usePripoStore = defineStore("pripo", {
  state: () => ({
    blogs: useQuery(GET_ALL_BLOGS),
  }),
});
