export const client = {
  service: {
    name: "pripo",
    // URL to the GraphQL API
    url: "https://pripo-db.hasura.app/v1/graphql",
  },
  // Files processed by the extension
  includes: ["src/**/*.vue", "src/**/*.ts"],
};
