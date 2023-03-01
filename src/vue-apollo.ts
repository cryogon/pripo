import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client/core";
import { provideApolloClient } from "@vue/apollo-composable";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
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
const wsLink = new GraphQLWsLink(
  createClient({
    url: `wss://pripo-db.hasura.app/v1/graphql`,
    connectionParams: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
);

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);
const cache = new InMemoryCache({
  typePolicies: {
    blogs: {
      fields: {
        favourites: {
          merge: false,
        },
      },
    },
    Subscription: {
      fields: {
        user_notifications: {
          merge: false,
        },
      },
    },
    comments: {
      fields: {
        liked_users: {
          merge: false,
        },
      },
    },
    user_notifications: {
      fields: {
        sender: {
          merge: false,
        },
      },
    },
    users: {
      fields: {
        followers: {
          merge: false,
        },
      },
    },
  },
});
export const apolloClient = new ApolloClient({
  link,
  cache,
});

export const apolloProvider = provideApolloClient(apolloClient);
