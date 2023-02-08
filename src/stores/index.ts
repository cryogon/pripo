import { LISTEN_NOTIFICATION } from "@/graphql";
import { useSubscription } from "@vue/apollo-composable";
import { defineStore } from "pinia";

export const usePripoStore = defineStore("pripo", {
  state: () => ({
    notification: useSubscription(LISTEN_NOTIFICATION),
  }),
});
