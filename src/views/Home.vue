<template>
  <div class="home">
    <van-empty v-if="error"></van-empty>
    <van-loading v-else-if="!isReady" />
    <template v-else>
      <div>{{ state }}</div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAsyncState } from "@vueuse/core";
import { getUserApi } from "@/api/user";
import { useStore } from "@/store";

export default defineComponent({
  name: "Home",
  setup() {
    const store = useStore();

    const { state, isReady, error } = useAsyncState(getUserApi, store.state.user);

    return { state, isReady, error };
  }
});
</script>
