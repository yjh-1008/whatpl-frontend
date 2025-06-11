<template>
  <div class="w-[100%] h-[100%] bg-gray-5 bg-opacity-50 fixed flex items-center justify-center z-50">
    <div class="bg-white w-[504px] h-[290px] relative rounded-md">
      <img src="/public/img/icons/close_black.svg" class="absolute w-[20px] h-[20px] right-[24px] top-[24px] cursor-pointer" @click="visible = false" />
      <div class="flex w-[100%] flex-col justify-center items-center gap-[16px] mt-[34px]">
        <div class="text-[24px] flex gap-2">
          <img :src="WhatplIcon" />
          <div>왓플</div>
        </div>
        <div class="text-p1-font-size">관심있는 사이드프로젝트를 손쉽게 찾아보세요</div>
      </div>
      <div class="flex justify-evenly gap-6 my-6 px-10">
        <!-- TODO... Icon 경로를 Props로 받는 컴포넌트로 변경. -->
        <button class="w-[88px] h-[88px] bg-kakao" @click="socialLogin('kakao')"></button>
        <button class="w-[88px] h-[88px] bg-naver" @click="socialLogin('naver')"></button>
        <button class="w-[88px] h-[88px] bg-google" @click="socialLogin('google')"></button>
        <button class="w-[88px] h-[88px] bg-github" @click="socialLogin('github')"></button>
      </div>
      <!-- TODO -->
      <NuxtLink class="text-center">
        <div class="text-neutral-tertiary cursor-pointer">계정을 잃어버리셨나요?</div>
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const { backEndBaseUrl } = runtimeConfig.public;
import WhatplIcon from '@/public/img/whatpl-logo.svg';
const socialLogin = (socialType: string) => {
  window.open(`${backEndBaseUrl}/oauth2/authorization/${socialType}`, '_self');
};

// const { _data } = await useCustomFetch().get('/images/project');

const visible = defineModel<boolean>();
</script>
