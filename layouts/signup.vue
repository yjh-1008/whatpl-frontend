<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import WpButton from '@/components/global/WpButton.vue';
const route = useRoute();
// 마이페이지 간략 버전
const isSimpleMyPage = ref(false);
// simpleMyPage div 외부 영역 클릭 처리
const simpleMyPagDivRef = ref(null);
onClickOutside(simpleMyPagDivRef, (event: PointerEvent) => {
  isSimpleMyPage.value = false;
});
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
    <main class="mt-[78px] flex flex-col grow flex-1 overflow-y-scroll" :class="route.query.param === '1' ? 'mb-[100px]' : 'mb-[152px]'">
      <slot />
    </main>
    <!-- Footer -->
    <footer :class="route.query.param === '1' ? 'h-[100px]' : 'h-[132px]'" class="fixed bottom-0 z-10 w-full border-t bg-white" id="sign-footer"></footer>
  </div>
</template>
