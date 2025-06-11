<script lang="ts" setup>
import { useElementSize } from '@vueuse/core';
import WpButton from '@/components/global/WpButton.vue';
import WpUserAvater from '@/components/global/WpUserAvater.vue';
import MyPageModal from '@/components/layout/MyPageModal.vue';
import SignInModal from '@/components/page/signup/SignInModal.vue';

const headerEl = ref(null);
const { width: headerWidth } = useElementSize(headerEl);

const router = useRouter();
const currentPath = computed(() => {
  return router.currentRoute.value.path;
});

const navigationMenu = ref([
  { title: '홈', path: '/' },
  { title: '왓피플', path: '/people' }
]);

// userL 쿠키값을 가져와 현재 사용자의 로그인 상태를 체크하고, true or false로 리턴한다.
const isLogined = computed(() => {
  const userL = useCookie('userL');

  if (userL.value) {
    if (userL.value === 'Y') {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
});
// userName 쿠키값을 가져와 현재 사용자의 이름을 리턴한다.
const userName = computed(() => {
  const userNameCookie = useCookie('userName');
  if (userNameCookie.value) {
    return userNameCookie.value;
  } else {
    return null;
  }
});
// memberId 쿠키값을 가져와 현재 사용자의 memberId를 리턴한다.
const memberId = computed(() => {
  const memberIdCookie = useCookie('memberId');

  if (memberIdCookie.value) {
    return memberIdCookie.value;
  } else {
    return null;
  }
});

/* 회원가입/로그인 Modal START */
const signInModalState = ref<boolean>(false);
const loginOrSignUp = () => {
  signInModalState.value = true;
};
/* 회원가입/로그인 Modal END */

/* 마이페이지 모달 START */
const isSimpleMyPage = ref(false);
/* 마이페이지 모달 END */

const clickRecruitmentButton = () => {
  if (isLogined.value === true) {
    navigateTo('/recruitment/new');
  } else {
    signInModalState.value = true;
  }
};
</script>

<template>
  <div class="flex flex-col">
    <!-- Header -->
    <header ref="headerEl" class="flex sticky top-0 w-full h-[78px] border-b border-outline bg-backround z-50">
      <!-- header inner container -->
      <div class="flex justify-between absolute top-6 right-6 bottom-6 left-6 items-center">
        <!-- left content container -->
        <div class="flex items-center">
          <!-- logo container -->
          <div class="flex items-center w-[85px]">
            <img src="/img/whatpl-logo.svg" />
            <div class="pl-2 text-neutral font-medium text-2xl">왓플</div>
          </div>
          <!-- navi menu container -->
          <div class="flex items-center pt-[3px] pb-[3px] pl-4 max-md:pl-1">
            <NuxtLink
              v-for="menu in navigationMenu"
              :key="menu.title"
              :to="menu.path"
              class="flex items-center justify-center text-lg w-[97px] font-normal text-neutral-tertiary"
              :class="{
                '!font-medium !text-neutral': currentPath === menu.path
              }"
            >
              {{ menu.title }}
            </NuxtLink>
          </div>
        </div>

        <!-- right content container -->
        <div class="flex items-center gap-x-4">
          <!-- Recruitment Button -->
          <div class="flex">
            <WpButton @click="clickRecruitmentButton" size="md" type="filled-neutral">
              <div class="flex items-center">
                <div class="pr-2" v-show="headerWidth >= 769">
                  <img src="/img/icons/write.svg" />
                </div>
                <div>모집글 작성</div>
              </div>
            </WpButton>
          </div>

          <!-- Login Button Container -->
          <div class="flex" v-if="!isLogined">
            <WpButton @click="loginOrSignUp" size="md" class="text-p1-font-size font-medium">{{ headerWidth >= 769 ? '로그인/회원가입' : '로그인' }}</WpButton>
          </div>

          <!-- tool icon &  user avater container -->
          <div class="flex items-center gap-x-4" v-if="isLogined">
            <!-- tool icon -->
            <div class="flex items-center">
              <img src="/img/icons/bell.svg" class="cursor-pointer" />
            </div>

            <!-- user avater -->
            <WpUserAvater class="w-6 h-6" @click="isSimpleMyPage = true" />
            <!-- MyPageModal -->
            <MyPageModal :isShow="isSimpleMyPage" :userName="userName" :memberId="memberId" @closeMyPageModal="isSimpleMyPage = false" />
          </div>
        </div>
      </div>
    </header>
    <!-- Pages -->
    <main>
      <slot />
    </main>
    <!-- SignIn Modal -->
    <SignInModal v-if="signInModalState" v-model="signInModalState" />
    <!-- Footer -->
    <footer></footer>
  </div>
</template>

<style scoped></style>
