<script lang="ts" setup>
import InfoIcon from '@/public/img/icons/exclamation.svg';
const props = defineProps<{
  total: number;
  cur: number;
}>();

const isOver = computed<string>(() => {
  return props.cur > props.total ? 'text-error' : 'text-neutral-tertiary';
});
const text = computed<string>(() => {
  return `${props.cur}/${props.total}`;
});
</script>

<template>
  <div class="flex gap-1">
    <div class="text-label2-font-size" :class="isOver">{{ text }}</div>
    <div v-show="cur > total"><img :src="InfoIcon" :class="isOver" class="w-4 h-4" /></div>
  </div>
</template>

<style></style>
