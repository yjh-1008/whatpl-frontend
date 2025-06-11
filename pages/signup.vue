<script lang="ts" setup>
import StepButton from '@/components/page/signup/StepButton.vue';
import type { GlobalDomainsResponse } from '@/typescript/interface/common';
import Step1 from '@/components/page/signup/Step1.vue';
import Step2 from '@/components/page/signup/Step2.vue';

definePageMeta({
  layout: 'signup',
  middleware: ['sign-up-guard']
});
// 페이지가 시작될 시점에 기본 정보를 들고있는지 확인.
//
let regPrimaryInfoCookie = useCookie('regPrimaryInfo');
const { $get } = useNuxtApp();
const route = useRoute();
const step = computed(() => route.query.step);
const domains = ref<GlobalDomainsResponse>();
const stepComponent = computed(() => {
  return step.value === '1' ? Step1 : Step2;
});
const str = (n: string) => `/signup?step=${n}`;
const curStep = (n: string): string => {
  return step.value === n ? 'border-on-primary-container text-on-primary-container border' : 'bg-neutral-container-secondary text-neutral-tertiary';
};

const loadGlobalDomains = async () => {
  const getDomains = await $get<GlobalDomainsResponse>('/domains');
  const getDomainsStatus = getDomains.status;

  if (getDomainsStatus === 200) {
    domains.value = getDomains._data;
    regPrimaryInfoCookie.value = String(true);
  }
};
loadGlobalDomains();
</script>

<template>
  <div class="flex flex-col">
    <div class="grow flex flex-col h-[618px]">
      <div class="w-[544px] h-[24px] mx-auto mt-[40px] font-semibol flex gap-4">
        <template v-for="n in ['1', '2']" :key="n">
          <StepButton :text="n" :class="curStep(n)"></StepButton>
        </template>
      </div>
      <component :is="stepComponent" :domainData="domains" />
    </div>
  </div>
</template>

<style></style>
