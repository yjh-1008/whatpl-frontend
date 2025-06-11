<script lang="ts" setup>
interface WpSelectModal {
  selectList?: string[];
  isMenuDiv?: boolean;
}

const props = withDefaults(defineProps<WpSelectModal>(), {
  selectList: () => [],
  isMenuDiv: false
});

const emits = defineEmits<{
  (e: 'menuSelect', event1: string): void;
  (e: 'menuHideOrShow', event1: boolean): void;
}>();

// 메뉴 선택
const select = (list: string) => {
  emits('menuSelect', list);
};
</script>

<template>
  <div class="flex rounded bg-backround border cursor-pointer shadow-[1px_2px_3px_rgba(0,0,0,0.12)] absolute top-9 w-full z-10" v-if="isMenuDiv">
    <div class="flex flex-col pt-1 pb-1 w-full">
      <div @click="select(list)" v-for="list in selectList" :key="list" class="flex justify-between px-3 py-1 hover:bg-[#11111114] active:bg-[#11111129]">
        <div class="flex text-neutral text-p2-font-size">
          {{ list }}
        </div>

        <!-- check icon -->
        <div class="flex" v-if="false">
          <img src="/img/icons/check.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
