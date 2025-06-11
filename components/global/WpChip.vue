<script lang="ts" setup>
const emits = defineEmits<{
  (e: 'click', event1: Event): void;
}>();

const click = (e: Event) => {
  emits('click', e);
};
</script>

<template>
  <button @click="click" class="flex rounded-full border border-outline pt-1 pr-2 pb-1 pl-2 bg-neutral-container-secondary text-gray-70 text-p1-font-size">
    <slot></slot>
  </button>
</template>

<style scoped></style>
