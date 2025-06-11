<script lang="ts" setup>
import type { RecruitmentNotice, RecruitmentNoticeProjectJobItem } from '@/typescript/interface/recruitment';
import RoundIcon from '@/components/page/home/RoundIcon.vue';
const props = defineProps<{
  project: RecruitmentNotice;
}>();
const emits = defineEmits<{
  (e: 'click'): void;
}>();
const runtimeConfig = useRuntimeConfig();
const { backEndBaseUrl } = runtimeConfig.public;
// const numberOfPeopleRecruited = ref<Number>(0);
const recruitedJobs = ref<String[]>([]);

const NumberOfApplicants = computed<number>(() => {
  const remainedJobs = props.project.remainedJobs.reduce((acc, cur) => {
    acc += Number(cur.recruitAmount);
    return acc;
  }, 0);
  return remainedJobs;
});

const numberOfPeopleRecruited = computed<number>(() => {
  const remainedJobs = props.project.remainedJobs.reduce((acc, cur) => {
    acc += Number(cur?.remainedAmount);
    return acc;
  }, 0);
  return remainedJobs;
});

// const representImage = computed;
</script>

<template>
  <div
    @click="emits('click')"
    style="background-image: url('https://images.unsplash.com/photo-1444044205806-38f3ed106c10')"
    class="!h-full !w-full bg-center bg-cover bg-no-repeat"
  >
    <div class="absolute left-6 bottom-6 z-20">
      <div class="flex gap-x-2">
        <div class="text-p2-font-size font-regular text-neutral-tertiary">[{{ props.project.subject }}]</div>
        <div class="bg-neutral rounded-[4px] py-[1px] pr-1 pl-[2px] justify-center flex h-[22px] w-[57px] items-center">
          <img src="/img/icons/thunder.svg" class="w-5" />
          <div class="text-primary font-medium ml-1 text-p2-font-size">인기</div>
        </div>
        <div v-if="project.profitable" class="flex gap-[2px] py-[1px] pl-1 pr-[6px] bg-green-10 rounded-full bg-opacity-20">
          <img src="/public/img/icons/won.svg" class="w-5 h-5" />
          <div v-show="project.profitable" class="text-on-primary-container text-p2-font-size font-medium">수익성</div>
        </div>
      </div>
      <div class="text-h3-font-size font-medium text-white mt-2 mb-3">{{ props.project.title }}</div>
      <div class="flex gap-4 text-label1-font-size font-regular items-center">
        <div class="flex gap-2">
          <div class="text-neutral-secondary">모집인원</div>
          <div class="text-white">
            <span> {{ numberOfPeopleRecruited }}명</span>
          </div>
          <div class="text-neutral-secondary">직군</div>
          <span class="text-white">{{ props.project.remainedJobs.map((item) => item.job).join(',') }}</span>
          <div class="text-neutral-secondary">기술스택</div>
          <ClientOnly>
            <div class="flex gap-1 py-[1px]">
              <template v-for="skill in project.skills" :key="skill">
                <RoundIcon :skill="skill" />
              </template>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
