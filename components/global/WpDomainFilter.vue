<template>
  <div v-if="props.isMenuDiv" class="w-[266px] bg-white p-4 flex top-9 flex-col gap-2 align-end absolute z-20 border rounded-[4px] domain-filter-box-shadow">
    <div>{{ props.title }}</div>
    <div class="flex gap-3 align-stretch flex-wrap content-start">
      <WpChip v-for="list in selectList" :key="list" @click="onSelect">
        <div class="flex gap-2 items-center content-center">
          <RoundIcon v-if="props.appendIcon" :skill="list" />
          <div>{{ list }}</div>
        </div>
      </WpChip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import RoundIcon from '@/components/page/home/RoundIcon.vue';
const emits = defineEmits<{
  (e: 'menuSelect', event1: string): void;
}>();
interface WpDomainFilterSelectModal {
  selectList?: string[];
  isMenuDiv?: boolean;
  appendIcon: boolean;
  title: string;
}
const props = defineProps<WpDomainFilterSelectModal>();

const onSelect = (e: Event) => {
  const target = e.target as HTMLDivElement;
  const value = target.innerText;
  // console.log(e);
  if (typeof value === 'string') {
    emits('menuSelect', value);
  }
};
</script>
