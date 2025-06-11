<script lang="ts" setup>
const props = defineProps<{
  tabMenu?: string[];
  modelValue?: string;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', event1: string): void;
}>();
</script>

<template>
  <div class="flex gap-6">
    <div
      v-for="menu in tabMenu"
      :key="menu"
      @click="emits('update:modelValue', menu)"
      class="flex cursor-pointer h-10"
      :class="menu === modelValue ? ' border-b-[3px] border-on-primary-container' : ''"
    >
      <p class="text-h3-font-size font-medium" :class="menu === modelValue ? ' text-neutral' : ' text-neutral-secondary font-normal'">{{ menu }}</p>
    </div>
  </div>
</template>

<style scoped></style>
