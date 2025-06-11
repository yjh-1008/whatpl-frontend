<script lang="ts" setup>
interface JobAndRecruitAmount {
  job: string;
  recruitAmount: number;
  selectList: string[];
}

const props = defineProps<JobAndRecruitAmount>();

const emits = defineEmits<{
  (e: 'plusRecruitAmount', event1: string): void;
  (e: 'minusRecruitAmount', event1: string): void;
  (e: 'deleteJobAndRecruitAmount', event1: Event): void;
  (e: 'update:recruitAmount', event1: Event, event2: string): void;
  (e: 'menuSelect', event1: string): void;
}>();

const updateRecruitAmount = (event1: Event) => {
  emits('update:recruitAmount', event1, props.job);
};
</script>

<template>
  <div class="flex flex-row gap-6 pb-3">
    <div class="flex items-center">
      <WpDropdown class="w-[217px]" :model-value="job" :selectList="selectList" @menuSelect="(job: string) => emits('menuSelect', job)" />
    </div>
    <div class="flex flex-row gap-3 items-center">
      <div class="flex rounded-full bg-neutral-container w-6 h-6 cursor-pointer" @click="(e: MouseEvent) => emits('minusRecruitAmount', job)">
        <img src="/img/icons/minus.svg" class="p-1" />
      </div>
      <div>
        <input
          type="number"
          class="border border-outline rounded w-[102px] h-8 text-center number-input-arrow-hide"
          :value="recruitAmount"
          @change="updateRecruitAmount"
        />
      </div>
      <div class="flex rounded-full bg-neutral-container w-6 h-6 cursor-pointer" @click="(e: MouseEvent) => emits('plusRecruitAmount', job)">
        <img src="/img/icons/plus.svg" class="p-1" />
      </div>
    </div>

    <div class="flex items-center justify-end w-full">
      <img src="/img/icons/close.svg" class="p-1 cursor-pointer" @click="(e: MouseEvent) => emits('deleteJobAndRecruitAmount', e)" />
    </div>
  </div>
</template>

<style scoped></style>
