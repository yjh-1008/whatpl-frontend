<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import WpDomainFilter from '@/components/global/WpDomainFilter.vue';

interface WpDropdown {
  modelValue?: any;
  placeholder?: string;
  selectList?: string[];
  disabled?: boolean;
}

interface DomainFilterDropdown extends WpDropdown {
  title: string;
  appendIcon?: boolean;
}

const props = withDefaults(defineProps<DomainFilterDropdown>(), {
  modelValue: '',
  selectList: () => [],
  disabled: false,
  placeholder: '',
  title: '',
  appendIcon: false
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
    <div class="flex h-7 justify-between items-center rounded-full border border-outline px-2 py-1 cursor-pointer text-p1-font-size h-full">
      <slot></slot>
      <div class="flex text-gray-50 ml-2 mr-3" v-if="!modelValue">{{ placeholder }}</div>
      <div class="ml-2 mr-3 flex text-p2-font-size font-regular text-sm" v-else>
        {{ modelValue }}
      </div>
      <div class="flex w-3 h-3">
        <img src="/img/icons/chevron-down.svg" />
      </div>
    </div>

    <WpDomainFilter
      class="text-p1-font-size font-light"
      :title="props.title"
      :appendIcon="appendIcon"
      :selectList="selectList"
      :isMenuDiv="isMenuDiv"
      @menuSelect="(list: string) => emits('menuSelect', list)"
    />
  </div>
</template>

<style scoped></style>
