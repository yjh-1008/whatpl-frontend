<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';

const props = defineProps<{
  isShow: boolean;
  userName: string | null;
  memberId: string | number | null;
}>();

const emits = defineEmits<{
  (e: 'closeMyPageModal'): void;
}>();

const simpleMyPagDivRef = ref(null);
onClickOutside(simpleMyPagDivRef, (event: PointerEvent) => {
  emits('closeMyPageModal');
});

const simpleMyPageMenu = ref([
  { title: '프로필 관리', path: `/users/${props.memberId}/info` },
  { title: '프로젝트 관리', path: `/users/${props.memberId}/projects` }
]);

const logout = async () => {
  const confirmResult = confirm('로그아웃 하시겠습니까?');

  if (!confirmResult) return;

  auth().clearUserApplicationCookie();
  localStorage.removeItem('newUser');
  await navigateTo('/');
  window.location.reload();
};
</script>

<template>
  <div
    ref="simpleMyPagDivRef"
    v-if="isShow"
    class="flex w-[300px] h-[234px] rounded bg-backround shadow-simple-my-page-box-shadow z-20 p-6 absolute top-[38px] right-0"
  >
    <!-- simple mypage inner container -->
    <div class="flex flex-col w-full">
      <!-- userAvater & userName & mail icon & menu container -->
      <div class="flex flex-col">
        <div class="flex items-center justify-between border-b border-outline pb-4">
          <div class="flex gap-4">
            <div class="flex w-[30px] h-[30px] bg-[#d9d9d9] rounded-full"></div>
            <div class="flex text-h1-font-size font-medium">{{ userName }}</div>
          </div>

          <NuxtLink to="/chat" @click="() => emits('closeMyPageModal')">
            <img src="/img/icons/mail.svg" class="cursor-pointer rounded hover:bg-[#11111114] active:bg-[#11111129]" />
          </NuxtLink>
        </div>

        <!-- menu -->
        <div class="flex flex-col">
          <NuxtLink
            v-for="myPageMenu in simpleMyPageMenu"
            :key="myPageMenu.title"
            :to="myPageMenu.path"
            @click="() => emits('closeMyPageModal')"
            class="h-[52px] pt-4 pb-4"
          >
            <div class="flex justify-between text-h3-font-size font-medium text-neutral">
              {{ myPageMenu.title }}
              <img src="/img/icons/chevron-right.svg" class="cursor-pointer" />
            </div>
          </NuxtLink>
        </div>

        <!-- logout -->
        <div class="flex pt-1 border-t border-outline-secondary">
          <div class="flex pt-3 w-full">
            <div @click="logout" class="flex rounded hover:bg-[#11111114] active:bg-[#11111129] cursor-pointer">
              <img src="/img/icons/logout.svg" class="cursor-pointer pr-1" />
              <div class="text-p2-font-size text-neutral-secondary font-medium">로그아웃</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
