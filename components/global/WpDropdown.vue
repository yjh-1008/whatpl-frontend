<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import WpSelectModal from '@/components/global/WpSelectModal.vue';

interface WpDropdown {
  modelValue?: any;
  placeholder?: string;
  selectList?: string[];
  disabled?: boolean;
}

const props = withDefaults(defineProps<WpDropdown>(), {
  modelValue: '',
  selectList: () => [],
  disabled: false,
  placeholder: ''
});

const emits = defineEmits<{
  (e: 'menuSelect', event1: string): void;
}>();

const isMenuDiv = ref(false);

const menuHideOrShow = () => {
  isMenuDiv.value = !isMenuDiv.value;
};
// dropdown menu div 외부 영역 클릭 처리
const dropdownMenuDivRef = ref(null);
onClickOutside(dropdownMenuDivRef, (event: PointerEvent) => {
  isMenuDiv.value = false;
});
</script>

<template>
  <div class="flex flex-col relative" @click="menuHideOrShow" ref="dropdownMenuDivRef">
    <div class="flex justify-between items-center rounded border border-outline pt-1 pr-3 pb-1 pl-3 cursor-pointer text-p1-font-size h-full">
      <div class="flex text-gray-50" v-if="!modelValue">{{ placeholder }}</div>
      <div class="flex" v-else>
        {{ modelValue }}
      </div>
      <div class="flex w-3 h-3">
        <img src="/img/icons/chevron-down.svg" />
      </div>
    </div>

    <WpSelectModal
      class="text-p1-font-size font-light"
      :selectList="selectList"
      :isMenuDiv="isMenuDiv"
      @menuSelect="(list: string) => emits('menuSelect', list)"
    />
  </div>
</template>

<style scoped></style>
