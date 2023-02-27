<template>
  <div class="containers">
    <global-header :user="currentUser"></global-header>
    <loader v-if="isLoading"></loader>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { GlobalDataProps } from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import GlobalHeader from "./components/GlobalHeader.vue";
import Loader from "./components/Loader.vue";
import request from "./request";
import createMessage from "./hooks/createMessage";
import { useRoute } from "vue-router";
export default defineComponent({
  name: "App",
  components: { GlobalHeader, Loader },
  setup() {
    const store = useStore<GlobalDataProps>();
    const currentUser = computed(() => store.state.user);
    const isLoading = computed(() => store.state.loading);
    const error = computed(() => store.state.error);
    watch(
      () => error.value.status,
      () => {
        const { status, message } = error.value;
        if (status && message) {
          createMessage(message, "error");
        }
      }
    );
    return {
      error,
      GlobalHeader,
      currentUser,
      isLoading,
      Loader,
    };
  },
});
</script>

<style lang="less"></style>
