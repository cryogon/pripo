import { ref, watch } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { useQuery } from "@vue/apollo-composable";
import { GET_USER } from "@/graphql";
export function useFetchUser() {
  const auth0 = useAuth0();
  const login = () =>
    auth0.loginWithRedirect({ redirect_uri: window.location.origin });
  const logout = () => auth0.logout({ returnTo: window.location.origin });
  const isAuthenticated = auth0.isAuthenticated;
  const U = auth0.user;
  //   await nextTick();
  //   await nextTick();
  const user = ref();
  watch(U, () => {
    user.value = useQuery(GET_USER, {
      username: U.value.nickname || U.value.preferred_username,
    });
  });

  return { user, login, logout, isAuthenticated };
}
