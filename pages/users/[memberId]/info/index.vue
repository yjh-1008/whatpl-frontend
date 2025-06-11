<script lang="ts" setup>
import WpChip from '@/components/global/WpChip.vue';
import WpTechStackChip from '@/components/global/WpTechStackChip.vue';
import PortfolioItem from '@/components/page/users/PortfolioItem.vue';
import type { GlobalDomainsResponse } from '~/typescript/interface/common';
import type { UserInfo } from '~/typescript/interface/user';
definePageMeta({
  layout: 'users'
});
const { $get } = useNuxtApp();
const route = useRoute();
// 프로젝트 리스트의 정보 불러오는 API
const domains = ref<GlobalDomainsResponse>();
const loadGlobalDomains = async () => {
  const getDomains = await $get<GlobalDomainsResponse>('/domains');
  const getDomainsStatus = getDomains.status;
  if (getDomainsStatus === 200) {
    domains.value = getDomains._data;
  }
};

loadGlobalDomains();
// 유저 프로필 조회
const { data: userData } = await useAsyncData('userData', async () => {
  const response = await $get<UserInfo>(`/members/${route.params.memberId}`);
  const data = response._data;
  return data;
});
</script>

<template>
  <div class="flex flex-col pt-6">
    <!-- 자기소개 -->
    <div class="flex flex-col gap-y-2 border-b border-outline">
      <p class="text-h3-font-size font-medium">자기소개</p>
      <div class="flex pb-6">
        {{ userData?.myInfo }}
      </div>
    </div>
    <!-- 관심있는 카테고리 -->
    <div class="flex-col gap-y-2 border-b border-outline pt-6">
      <p class="text-h3-font-size font-medium">관심있는 카테고리</p>
      <ClientOnly>
        <div class="flex flex-wrap pb-6 pt-3 gap-3">
          <WpChip v-for="dom in userData?.subjects" :key="dom"> {{ dom }}</WpChip>
        </div>
      </ClientOnly>
    </div>
    <!-- 기술 스택 -->
    <div class="flex-col gap-y-2 border-b border-outline pt-6">
      <p class="text-h3-font-size font-medium">기술 스택</p>
      <ClientOnly>
        <div class="flex flex-wrap pb-6 pt-3 gap-3">
          <WpTechStackChip v-for="techStackItem in userData?.skills" :key="techStackItem" :isShowClose="false" :techName="techStackItem" />
        </div>
      </ClientOnly>
    </div>
    <!-- 작업에 투자 가능한 시간 -->
    <div class="flex-col gap-y-2 border-b border-outline pt-6">
      <p class="text-h3-font-size font-medium">작업에 투자 가능한 시간</p>
      <div class="flex flex-wrap pb-6 pt-3 gap-3">
        <p class="text-p1-font-size text-neutral-secondary">{{ userData?.workTime }}</p>
      </div>
    </div>
    <!-- 포트폴리오 & 링크 -->
    <div class="flex-col gap-y-2 border-b border-outline pt-6">
      <!-- 포트폴리오 -->
      <p class="text-h3-font-size font-medium">포트폴리오</p>
      <div class="flex flex-wrap pb-6 pt-3 gap-4">
        <PortfolioItem v-for="pofol in userData?.portfolioUrls" :key="pofol" />
      </div>
      <!-- 링크 -->
      <p class="text-h3-font-size font-medium">링크</p>
      <div class="flex flex-col flex-wrap pb-6 pt-3 gap-3">
        <NuxtLink
          v-for="link in userData?.links"
          :key="link"
          :to="link"
          :external="true"
          target="_blank"
          class="text-neutral-secondary text-p2-font-size underline flex flex-row gap-x-2"
        >
          <img :src="link" />
          {{ link }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
