<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig();
const { backEndBaseUrl } = runtimeConfig.public;

const props = defineProps<{
  techName: string;
  isShowClose: boolean;
}>();

const emits = defineEmits<{
  (e: 'deleteTechStackChip', event1: string): void;
}>();
</script>

<template>
  <div class="flex rounded-full border h-8 border-outline-secondary bg-neutral-container px-2 py-1 text-gray-70 text-p1-font-size">
    <div class="flex items-center gap-2">
      <div class="flex">
        <img :src="`${backEndBaseUrl}/images/skill/${techName}`" class="w-5 h-5 rounded-full" />
      </div>
      <div class="flex text-[#000000] font-medium">{{ techName }}</div>
      <div class="flex hover:bg-[#11111114] hover:rounded cursor-pointer" v-if="isShowClose">
        <img src="/img/icons/close.svg" @click="() => emits('deleteTechStackChip', techName)" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
