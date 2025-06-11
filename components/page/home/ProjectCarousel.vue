<template>
  <div class="w-[155px] h-5 flex gap-6 items-center">
    <button @click="emits('prev')" class="flex items-center w-5 h-5">
      <img src="/img/icons/chevron-left.svg" />
    </button>

    <div class="grow text-center text-p2-font-size text-neutral-tertiary">{{ props.currentIndex }}/{{ props.totalIndex }}</div>
    <button @click="emits('next')" class="flex items-center w-5 h-5">
      <img src="/img/icons/chevron-right.svg" />
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  currentIndex: number;
  totalIndex?: number;
}>();

const emits = defineEmits<{
  (e: 'next'): void;
  (e: 'prev'): void;
}>();
</script>

<style></style>
