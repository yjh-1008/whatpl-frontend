<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';

const props = defineProps<{
  searchKeyword: string;
  techStackList: string[];
  placeholder?: string;
  type?: string;
}>();

const emits = defineEmits<{
  (e: 'update:searchKeyword', event1: Event): void;
  (e: 'selectTechStack', event1: string): void;
  (e: 'clear'): void;
}>();

const runtimeConfig = useRuntimeConfig();
const { backEndBaseUrl } = runtimeConfig.public;

// input 클릭 여부 flag
const clickFlag = ref(false);
// input 외부 영역 클릭 처리
const inputRef = ref(null);
onClickOutside(inputRef, (event: PointerEvent) => {
  clickFlag.value = false;
});

// input 클릭시 class를 동적으로 변경하기위한 computed
const topLevelContainerClass = computed(() => {
  if (clickFlag.value || props.searchKeyword.length) {
    return 'flex flex-col w-full border border-on-primary-container bg-white h-full rounded';
  } else {
    return 'flex flex-col w-full border border-outline-secondary bg-neutral-container-secondary h-full rounded';
  }
});
</script>

<template>
  <!-- top-level container -->
  <div :class="topLevelContainerClass">
    <div class="flex justify-between items-center px-3 py-[6px] h-8">
      <div class="flex w-full">
        <img src="/img/icons/search.svg" class="pr-2" />
        <input
          :value="searchKeyword"
          @input="(e: Event) => emits('update:searchKeyword', e)"
          :type="type"
          @click="clickFlag = !clickFlag"
          :placeholder="placeholder"
          ref="inputRef"
          class="w-full h-full focus:outline-none bg-transparent text-p2-font-size"
        />
      </div>

      <div class="flex cursor-pointer" v-if="searchKeyword.length">
        <img src="/img/icons/close.svg" @click="() => emits('clear')" />
      </div>
    </div>

    <div v-if="searchKeyword && techStackList.length" class="border-t border-outline-secondary mx-3 my-1"></div>

    <!-- search -->
    <div v-if="searchKeyword && techStackList.length" class="flex flex-col pb-2" ref="techListRef">
      <div
        v-for="techName in techStackList"
        :key="techName"
        @click="() => emits('selectTechStack', techName)"
        class="flex cursor-pointer px-3 py-1 hover:bg-[#11111114] active:bg-[#11111129]"
      >
        <div class="flex">
          <img :src="`${backEndBaseUrl}/images/skill/${techName}`" class="w-5 h-5 rounded-full" />
        </div>
        <div class="flex pl-2 text-p2-font-size text-[#000000] font-normal">{{ techName }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
