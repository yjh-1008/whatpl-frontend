<script lang="ts" setup>
import LikeSVG from '@/public/img/icons/like.svg';
import LikeFillSvg from '@/public/img/icons/like-fill.svg';
import RoundIcon from '@/components/page/home/RoundIcon.vue';
import type {
  RecruitmentNotice,
  RecruitmentNoticeProjectJobItem,
  RecruitmentPost,
  RecruitmentPostProjectJobParticipantItem
} from '@/typescript/interface/recruitment';
const emits = defineEmits<{
  (e: 'click'): void;
}>();
const props = defineProps<{
  project: RecruitmentNotice;
}>();

const totalJobs = computed<string[]>(() => {
  return props.project.remainedJobs.map((item: RecruitmentNoticeProjectJobItem | RecruitmentPostProjectJobParticipantItem) => item.job);
});

const totalRecruitAmount = computed<number>(() => {
  const total = props.project.remainedJobs.reduce((a: number, b: RecruitmentNoticeProjectJobItem | RecruitmentPostProjectJobParticipantItem): number => {
    return (a += b.recruitAmount);
  }, 0);
  return total;
});
const myLike = ref<boolean>(props.project.myLike);

const likeClick = (e: Event) => {
  e.preventDefault();
  myLike.value = !myLike.value;
};
</script>

<template>
  <div
    class="xl:w-[590px] grow self-stretch w-full 2xl:w-[670px] lg:h-[352px] lg:w-[394px] xl:h-[166px] lg:flex-col xl:flex-row flex xl:items-start lg:p-3 xl:p-4 xl:gap-6 border border-rounded bg-white"
    @click="emits('click')"
  >
    <img
      src="/public/img/icons/구글.svg"
      class="xl:w-[144px] xl:h-[132px] lg:h-[160px] lg:rounded-[4px] lg:w-full border lg:bg-no-repeat lg:bg-cover lg:self-stretch"
    />
    <div class="flex grow flex-col lg:mt-4 xl:mt-0">
      <!-- header -->
      <div class="flex justify-between">
        <div>[{{ project.subject }}]</div>
        <img class="w-5 h-5 cursor-pointer" @click.stop="likeClick" :src="myLike ? LikeFillSvg : LikeSVG" />
      </div>
      <!-- title -->
      <div class="flex gap-2 items-center">
        <div class="text-h3-font-size font-medium leading-h1-line-height">{{ project.title }}</div>
        <div class="text-label2-font-size font-normal leading-5 text-error w-5 h-5">New</div>
        <div class="text-label2-font-size font-normal leading-5 text-success w-5 h-5">Remind</div>
      </div>
      <!-- content -->
      <div class="mt-[14px] lg:flex lg:flex-col lg:gap-1 2xl:grid 2xl:row-span-2">
        <div class="flex xl:flex-col lg:gap-6 xl:gap-1 items-start text-label1-font-size font-regular">
          <div class="flex gap-2 items-start">
            <div class="text-neutral-tertiary w-15">모집 인원</div>
            <div>{{ totalRecruitAmount }}명</div>
          </div>
          <div class="flex gap-2 items-start text-label1-font-size font-regular">
            <div class="text-neutral-tertiary">직군</div>
            <div class="grow truncate">{{ totalJobs.join(',') }}</div>
          </div>
        </div>
        <div class="xl:flex xl:justify-between">
          <div class="flex justify-between text-label1-font-size font-regular">
            <div class="font-regular text-label1-font-size flex items-center">
              <div class="text-neutral-tertiary">기술 스택</div>
              <ClientOnly>
                <div class="flex ml-2 gap-1">
                  <RoundIcon :skill="skill" v-for="skill in props.project.skills" :key="skill" />
                </div>
              </ClientOnly>
            </div>
          </div>
          <div class="flex gap-1 lg:mt-6 xl:mt-0">
            <img class="w-5 h-5" src="/public/img/icons/eye.svg" />
            <div class="leading-5 font-normal text-label1-font-size text-neutral-tertiary">{{ project.views }}</div>
            <img class="w-5 h-5 cursor-pointer" src="/public/img/icons/comment.svg" />
            <div class="leading-5 font-normal text-label1-font-size text-neutral-tertiary">{{ project.comments }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
