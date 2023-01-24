import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { provideApolloClient } from "@vue/apollo-composable";
// import { WebSocketLink } from "@apollo/client/link/ws";
// import { getMainDefinition } from "@apollo/client/utilities";
const token = localStorage.getItem("token");
const guestUser = {
  "content-type": "application/json",
};
const headers = token
  ? {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  : guestUser;
const httpLink = createHttpLink({
  headers,
  uri: "https://pripo-db.hasura.app/v1/graphql",
});
// const wsLink = new WebSocketLink({
//   uri: `ws://pripo-db.hasura.app/v1/graphql`,
//   options: {
//     reconnect: true,
//   },
// });

// //Will use later when subscription will be implemented
// const link = split(
//   // split based on operation type
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === "OperationDefinition" &&
//       definition.operation === "subscription"
//     );
//   },
//   wsLink,
//   httpLink
// );
const cache = new InMemoryCache();
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

export const apolloProvider = provideApolloClient(apolloClient);
