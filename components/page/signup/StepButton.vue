<script lang="ts" setup>
const emits = defineEmits<{
  (e: 'onClick'): void;
}>();
const props = defineProps<{
  text: string | number;
}>();
</script>

<template>
  <div @click="emits('onClick')" class="w-[24px] h-[24px] rounded-full h3-font-size text-center">{{ props.text }}</div>
</template>

<style></style>
