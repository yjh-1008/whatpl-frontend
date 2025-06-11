<script lang="ts" setup>
const props = defineProps<{
  tabMenu?: { tabName: string; path: string }[];
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
      :key="menu.tabName"
      @click="emits('update:modelValue', menu.tabName)"
      class="flex cursor-pointer h-10"
      :class="menu.tabName === modelValue ? ' border-b-[3px] border-on-primary-container' : ''"
    >
      <NuxtLink :to="menu.path">
        <p class="text-h3-font-size font-medium" :class="menu.tabName === modelValue ? ' text-neutral' : ' text-neutral-secondary font-normal'">
          {{ menu.tabName }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped></style>
