<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import WpButton from '@/components/global/WpButton.vue';
import type { GlobalUserInfo } from '@/typescript/interface/user';
import Edit from '@/pages/users/[memberId]/info/edit.vue';
import ConfirmModal from '@/components/global/WpConfirmModal.vue';
import type { BackEndBaseResponse } from '~/typescript/interface/common';
const route = useRoute();
const router = useRouter();
const { $get, $pos, $put } = useNuxtApp();
// 마이페이지 간략 버전
export interface APIUserInfo {
  nickname: string;
  job: string;
  career: string;
  skills: string[];
  myInfo: string;
  profileOpen: boolean;
  workTime: string;
  links: string[];
  portfolioUrls: string[];
  subjects: string[];
}
const isSimpleMyPage = ref(false);
const infoRef = ref<InstanceType<typeof Edit> | null>(null);
const confirmModalComponentRef = ref<InstanceType<typeof ConfirmModal> | null>(null);
// simpleMyPage div 외부 영역 클릭 처리
const simpleMyPagDivRef = ref(null);
onClickOutside(simpleMyPagDivRef, (event: PointerEvent) => {
  isSimpleMyPage.value = false;
});
const userInfo = ref<APIUserInfo>({
  nickname: '',
  job: '',
  career: '',
  skills: [],
  myInfo: '',
  profileOpen: true,
  workTime: '',
  links: [],
  portfolioUrls: [''],
  subjects: []
});
const { data: user, refresh: userInfoRefresh } = await useAsyncData('userInfo', async () => {
  const userData = await $get<GlobalUserInfo>(`/members/${route.params.memberId}`);
  const status = userData.status;
  const result = userData._data;
  if (status !== 200) {
    if (result && isBackendError(result)) {
      throw showError({ fatal: true, statusCode: Number(result.code), message: result.message });
    }
  }
  if (!result) return {};
  const { career, job, nickname, skills, myInfo, profileOpen, workTime, references, portfolioUrls, subjects } = result;
  userInfo.value = {
    career: career ?? '',
    job: job ?? '',
    nickname: nickname ?? '',
    skills: skills ?? [],
    myInfo: myInfo ?? '',
    profileOpen: profileOpen ?? true,
    workTime: workTime ?? '',
    links: references ?? [],
    subjects: subjects ?? [],
    portfolioUrls: portfolioUrls ?? []
  };
  return result;
});

const getBody = async () => {
  const formData = new FormData();
  if (!infoRef.value?.userInfo) return;
  const jsonData = {
    nickname: userInfo.value.nickname,
    subjects: userInfo.value.subjects,
    skills: userInfo.value.skills,
    references: userInfo.value.links,
    workTime: userInfo.value.workTime,
    job: userInfo.value.job,
    career: '2년차',
    isPofileOpen: userInfo.value.profileOpen,
    deletePortfolioIds: []
  };
  const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
  formData.append('info', blob);
  const portfolios = await infoRef.value.portfolios;
  for (const file of portfolios) {
    formData.append('portfolios', file);
  }
  return formData;
};
const save = async () => {
  const body = await getBody();

  const result = await $put(`/members/${route.params.memberId}`, body);
  if (!result.ok) {
    const data = result._data as BackEndBaseResponse;
    confirmModalComponentRef.value?.confirmModalShow({
      title: data.message,
      subTitle1: '',
      subTitle2: '',
      isCancel: false,
      confirmButtonName: '확인'
    });
  } else {
    router.push(`/users/${route.params.memberId}/info`);
  }
};
</script>

<template>
  <div class="flex flex-col h-[100vh] overflow-hidden">
    <!-- Header -->
    <header class="flex w-full fixed top-0 z-10 h-[78px] border-b bg-white border-outline">
      <!-- header inner container -->
      <div class="flex justify-between p-6 items-center">
        <!-- left content container -->
        <div class="flex items-center">
          <!-- logo container -->
          <div class="flex items-center w-[85px]">
            <img src="/img/whatpl-logo.svg" />
            <div class="pl-2 text-neutral font-medium text-2xl">왓플</div>
          </div>
          <!-- layout title container -->
          <div class="flex items-center pt-[3px] pl-4">
            <p class="font-medium text-h2-font-size">회원가입</p>
          </div>
        </div>
      </div>
    </header>
    <!-- Pages -->
    <main class="mt-[78px] flex flex-col grow flex-1 overflow-y-scroll mb-[100px]">
      <ClientOnly>
        <Edit ref="infoRef" v-model:userInfo="userInfo" />
      </ClientOnly>
    </main>
    <!-- Footer -->
    <footer class="fixed w-full bottom-0 border-t pt-6 pb-8">
      <div class="w-[544px] justify-center gap-4 items-center flex mx-auto">
        <NuxtLink class="grow" :to="`/users/${route.params.memberId}/info`" v-slot="{ navigate }">
          <WpButton class="w-full pa-4" type="filled-primary" @click="navigate"><div>취소</div></WpButton>
        </NuxtLink>
        <WpButton class="grow pa-4" type="filled-primary" @click="save"><div>저장</div></WpButton>
      </div>
    </footer>
    <Teleport to="body">
      <ConfirmModal ref="confirmModalComponentRef" />
    </Teleport>
  </div>
</template>
