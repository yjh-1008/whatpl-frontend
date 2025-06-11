<script lang="ts" setup>
import type {
  RecruitmentNotice,
  RecruitmentNoticeProjectJobItem,
  RecruitmentPost,
  RecruitmentPostProjectJobParticipantItem
} from '@/typescript/interface/recruitment';
import LikeSVG from '@/public/img/icons/like.svg';
import LikeFillSvg from '@/public/img/icons/like-fill.svg';
import RoundIcon from '@/components/page/home/RoundIcon.vue';
const emits = defineEmits<{
  (e: 'click'): void;
}>();
const { $put, $get, $cDelete } = useNuxtApp();
const props = defineProps<{
  project: RecruitmentNotice;
}>();
const project = ref<RecruitmentNotice>(props.project);
const totalRecruitAmount = computed<number>(() => {
  const total = props.project.remainedJobs.reduce((a: number, b: RecruitmentNoticeProjectJobItem | RecruitmentPostProjectJobParticipantItem): number => {
    return (a += b.recruitAmount);
  }, 0);
  return total;
});

const refreshProject = async () => {
  const loadRecruitmentPostData = await $get<RecruitmentPost>(`/projects/${project.value.projectId}`);
  const loadRecruitmentPostDataStatus = loadRecruitmentPostData.status;
  const loadRecruitmentPostDataResult = loadRecruitmentPostData._data;
  if (loadRecruitmentPostDataStatus !== 200) {
    if (loadRecruitmentPostDataResult && isBackendError(loadRecruitmentPostDataResult)) {
      throw showError({ fatal: true, statusCode: Number(loadRecruitmentPostDataResult.code), message: loadRecruitmentPostDataResult.message });
    }
  }
  if (loadRecruitmentPostDataResult) {
    project.value = {
      remainedJobs: loadRecruitmentPostDataResult.projectJobParticipants,
      ...loadRecruitmentPostDataResult,
      representImageUri: props.project.representImageUri
    };
  }
};

const totalJobs = computed<string[]>(() => {
  return project.value.remainedJobs.map((item: RecruitmentNoticeProjectJobItem | RecruitmentPostProjectJobParticipantItem) => item.job);
});
const myLike = ref<boolean>(props.project.myLike);
const clickMyLike = async () => {
  myLike.value = !myLike.value;
  if (project.value.myLike) {
    await $cDelete(`/projects/${project.value.projectId}/likes`, {}).then((res) => refreshProject());
  } else {
    await $put(`/projects/${project.value.projectId}/likes`, {}).then((res) => refreshProject());
  }
};
</script>

<template>
  <div @click="emits('click')" class="flex flex-col w-[408px] lg:w-full xl:grow border border-rounded p-4 h-[168px] justify-cetner align-start self-stretch">
    <!-- header -->
    <div class="flex justify-between">
      <div>[{{ project.subject }}]</div>
      <div class="flex gap-1">
        <img class="w-5 h-5" src="/public/img/icons/eye.svg" />
        <div class="leading-5 font-normal text-label1-font-size text-neutral-tertiary">{{ project.views }}</div>
        <img class="w-5 h-5 cursor-pointer" src="/public/img/icons/comment.svg" />
        <!-- <div class="leading-5 font-normal text-label1-font-size text-neutral-tertiary">{{ project.comments?.comments.length }}</div> -->
        <div class="leading-5 font-normal text-label1-font-size text-neutral-tertiary">{{ project.comments }}</div>
        <img class="w-5 h-5 cursor-pointer" @click="clickMyLike" :src="myLike ? LikeFillSvg : LikeSVG" />
      </div>
    </div>
    <!-- title -->
    <div class="flex gap-2 items-center">
      <div class="text-h3-font-size font-medium leading-h1-line-height truncate">{{ project.title }}</div>
      <div class="text-label2-font-size font-normal leading-5 text-error w-5 h-5">New</div>
      <div class="text-label2-font-size font-normal leading-5 text-success w-5 h-5">Remind</div>
    </div>
    <!-- content -->
    <div class="bg-neutral-container-secondary w-full p-3 mt-3">
      <div class="flex flex-col gap-2">
        <div class="flex gap-4 items-start self-stretch font-regular text-label1-font-size">
          <div class="flex gap-2">
            <div class="text-neutral-tertiary whitespace-nowrap">모집 인원</div>
            <div class="whitespace-nowrap">{{ totalRecruitAmount }}명</div>
          </div>
          <div class="flex gap-2 grow truncate">
            <div class="text-neutral-tertiary whitespace-nowrap">직군</div>
            <div class="grow truncate">{{ totalJobs.join(',') }}</div>
          </div>
        </div>
        <div class="flex">
          <div class="font-regular text-label1-font-size flex items-center">
            <div class="text-neutral-tertiary">기술 스택</div>
            <ClientOnly>
              <div class="ml-2 flex gap-1">
                <RoundIcon :skill="skill" v-for="skill in props.project.skills" :key="skill" />
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
