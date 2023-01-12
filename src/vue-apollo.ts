import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { provideApolloClient } from "@vue/apollo-composable";
const token = localStorage.getItem("token");
const headers = {
  "content-type": "application/json",
  Authorization: token ? `Bearer ${token}` : null,
};
const httpLink = createHttpLink({
  headers,
  uri: "https://pripo-db.hasura.app/v1/graphql",
});

const cache = new InMemoryCache();
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

export const apolloProvider = provideApolloClient(apolloClient);
