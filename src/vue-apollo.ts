import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { provideApolloClient } from "@vue/apollo-composable";

const headers = {
  "content-type": "application/json",
  "x-hasura-admin-secret":
    "kXS1NkCEOlP5hVuCLBJ2tjgqs7QXb5WdEqh8okYTqB4uP3hQYE2LuUVf6IkU90A4",
};
// Authorization: "Bearer " + localStorage.getItem("token") || "",
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
