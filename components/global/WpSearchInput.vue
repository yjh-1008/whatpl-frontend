<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  type?: string;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', event1: Event): void;
  (e: 'clear'): void;
}>();

// input 클릭 여부 flag
const clickFlag = ref(false);
// input 외부 영역 클릭 처리
const inputRef = ref(null);
onClickOutside(inputRef, (event: PointerEvent) => {
  clickFlag.value = false;
});

// input 클릭시 class를 동적으로 변경하기위한 computed
const topLevelContainerClass = computed(() => {
  if (clickFlag.value || props.modelValue.length) {
    return 'flex flex-col w-full border border-on-primary-container bg-white h-full rounded';
  } else {
    return 'flex flex-col w-full border border-outline-secondary bg-neutral-container-secondary h-full rounded';
  }
});
</script>

<template>
  <!-- top-level container -->
  <div :class="topLevelContainerClass">
    <div class="flex justify-between items-center px-3 py-[6px]">
      <div class="flex w-full">
        <img src="/img/icons/search.svg" class="pr-2" />
        <input
          :value="modelValue"
          @input="(e: Event) => emits('update:modelValue', e)"
          :type="type"
          @click="clickFlag = !clickFlag"
          :placeholder="placeholder"
          ref="inputRef"
          class="w-full h-full focus:outline-none bg-transparent text-p2-font-size"
        />
      </div>

      <div class="flex cursor-pointer" v-if="modelValue.length">
        <img src="/img/icons/close.svg" @click="() => emits('clear')" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
