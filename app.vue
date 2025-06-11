<script setup lang="ts">
import WpGlobalLoading from '@/components/global/WpGlobalLoading.vue';

const globalStore = useGlobalStore();
const { isGlobalLoading } = storeToRefs(globalStore);
</script>

<template>
  <WpGlobalLoading v-if="isGlobalLoading" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style></style>
