<script lang="ts" setup>
import { useAuth0 } from "@auth0/auth0-vue";

const { loginWithRedirect } = useAuth0();

const handleLogin = async () => {
  loginWithRedirect();
};
</script>

<template>
  <button id="loginButton" type="submit" @click="handleLogin">Login</button>
</template>
