import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBold,
  faItalic,
  faStrikethrough,
  faHeading,
  faParagraph,
  faEllipsisVertical,
  faReply,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import { faPaperPlane, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import "./assets/main.css";

library.add(
  faBold,
  faItalic,
  faStrikethrough,
  faHeading,
  faParagraph,
  faPaperPlane,
  faEllipsisVertical,
  faThumbsUp,
  faReply,
  faChevronDown
);

const app = createApp(App);
app.component("fa-icon", FontAwesomeIcon);
app.use(createPinia());
app.use(router);

app.mount("#app");
