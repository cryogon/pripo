import { createApp, h, provide } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "./vue-apollo";
import { createAuth0 } from "@auth0/auth0-vue";
import { faChevronDown, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import "./assets/main.css";

library.add(faChevronDown, faArrowLeft);
const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});
app.component("fa-icon", FontAwesomeIcon);
app
  .use(createPinia())
  .use(router)
  .use(
    createAuth0({
      domain: "pripo.us.auth0.com",
      clientId: "gjxDd294BjPO9MUqimrzNj2iKaMzVVAr",
      cacheLocation: "localstorage",
      authorizationParams: {
        audience: "https://pripo-api.vercel.app",
        redirect_uri: window.location.origin,
      },
    })
  );
app.mount("#app");
