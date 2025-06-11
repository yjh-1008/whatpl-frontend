<template>
  <img class="w-4 h-4 rounded-full border" :src="`${backEndBaseUrl}/images/skill/${props.skill}`" :alt="props.skill" />
</template>

<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig();
const { backEndBaseUrl } = runtimeConfig.public;
const props = defineProps<{
  skill: string;
}>();
</script>

<style></style>
