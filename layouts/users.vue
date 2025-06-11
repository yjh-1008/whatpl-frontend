<script lang="ts" setup>
import { useElementSize } from '@vueuse/core';
import WpButton from '@/components/global/WpButton.vue';
import WpUserAvater from '@/components/global/WpUserAvater.vue';
import WpLinkTab from '@/components/global/WpLinkTab.vue';
import MyPageModal from '@/components/layout/MyPageModal.vue';
import OfferJoinModal from '@/components/page/users/OfferJoinModal.vue';
import type { UserInfo } from '@/typescript/interface/user';
// import WpConfirmModal from ''
const { $post, $get, $put } = useNuxtApp();
const headerEl = ref(null);
const route = useRoute();
const { width: headerWidth } = useElementSize(headerEl);
const router = useRouter();
const currentPath = computed(() => {
  return router.currentRoute.value.path;
});
const { data: userData } = await useAsyncData(
  'userData',
  async () => {
    const response = await $get<UserInfo>(`/members/${route.params.memberId}`);
    const data = response._data;
    return data;
  },
  { server: false }
);

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

/* 마이페이지 모달 START */
const isSimpleMyPage = ref(false);
/* 마이페이지 모달 END */

const clickRecruitmentButton = () => {
  navigateTo('/recruitment/new');
};

const isMe = computed<boolean>(() => {
  return memberId.value?.toString() === router.currentRoute.value.params.memberId;
});
const headerButtonName = computed(() => {
  return isMe.value ? '프로필 수정' : '제안하기';
});

// 제안하기, 프로필 수정 버튼 기능 구현
// 합류 제안 모달
const offerOfJoinModalState = ref<boolean>(false);
// confirm modal
const confirmModalComponentRef = ref();
const confirmModalShow = async () => {
  offerOfJoinModalState.value = false;
  const modalResult = await confirmModalComponentRef.value.confirmModalShow({
    title: '합류를 제안했어요',
    subTitle1: '[신발 발매 정보 플랫폼 ios 모집]',
    subTitle2: '직무: 프론트엔드',
    isCancel: false,
    confirmButtonName: '확인'
  });
};

const userSectionBtnClick = async () => {
  // offerOfJoinModalState.value = true;
  // confirmModalShow();

  if (headerButtonName.value !== '프로필 수정') {
    try {
      const body = {
        applyJob: '백엔드',
        applyType: 'APPLY',
        content: 'test content'
      };

      await $post('/projects/1/apply', body);
    } catch (err) {
      console.log(err);
    }
  } else {
    const memberIdCookie = useCookie('memberId');
    router.push(`/users/${route.params.memberId}/info/edit`);
  }
};

// 유저 프로필 사진
const updateUserProfilePicture = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;
  const formData = new FormData();
  formData.append('picture', files[0]);
  const response = await $put(`/members/${route.params.memberId}/picture`, formData);
};

/* 페이지 탭 메뉴 START */
const usersPageTabMenu = ref([
  { tabName: '정보', path: `/users/${memberId.value}/info` },
  { tabName: '프로젝트', path: `/users/${memberId.value}/projects` }
]);
const usersPageTab = ref('');
watch(
  () => router.currentRoute.value,
  () => {
    if (router.currentRoute.value.path === `/users/${memberId.value}/info`) {
      usersPageTab.value = '정보';
    } else {
      usersPageTab.value = '프로젝트';
    }
  },
  { immediate: true }
);
/* 페이지 탭 메뉴 END */
</script>

<template>
  <div class="flex flex-col">
    <!-- Top Header -->
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

    <!-- profile container -->
    <div class="flex w-full bg-neutral-container h-[152px] justify-center items-center">
      <div class="flex w-[922px] items-center justify-between">
        <!-- avater container -->
        <div class="flex gap-x-6">
          <!-- avater -->
          <input type="file" class="hidden" @change="updateUserProfilePicture" id="user-avatar" accept=".jpg, .jpeg, .png" />
          <label for="user-avatar">
            <div class="flex w-[72px] h-[72px] rounded-full bg-backround relative items-center justify-center">
              <img src="/img/icons/default-user.svg" />
              <div class="flex w-[26px] h-[26px] bg-primary-container rounded-full absolute top-[46px] left-[46px] justify-center items-center cursor-pointer">
                <img src="/img/icons/edit-on-primary-container.svg" class="w-[18px] h-[18px]" />
              </div>
            </div>
          </label>

          <div class="flex flex-col pt-[6px] gap-y-3">
            <p class="text-h1-font-size font-medium">{{ userData?.nickname }}</p>
            <div class="flex gap-x-2 text-p2-font-size items-center text-neutral-secondary">
              <p>{{ userData?.job }}</p>
              <div class="text-outline-secondary">|</div>
              <div>{{ userData?.career }}</div>
            </div>
          </div>
        </div>
        <!-- button wrapper -->
        <div class="flex">
          <WpButton
            @click="userSectionBtnClick"
            size="md"
            type="filled-neutral-tertiary"
            :class="{ '!bg-primary !text-neutral': headerButtonName === '제안하기' }"
          >
            {{ headerButtonName }}
          </WpButton>
        </div>
      </div>
    </div>

    <!-- content container -->
    <div class="flex w-full items-center justify-center">
      <div class="flex flex-col w-[922px]">
        <div class="border-b border-outline pt-3 w-full">
          <WpLinkTab :tabMenu="usersPageTabMenu" :modelValue="usersPageTab" @update:modelValue="(tabName: string) => (usersPageTab = tabName)" />
        </div>
        <!-- pages -->
        <main>
          <slot />
        </main>
      </div>
    </div>
    <OfferJoinModal @submit="confirmModalShow" v-model="offerOfJoinModalState" />
    <WpConfirmModal ref="confirmModalComponentRef" />
  </div>
</template>

<style scoped></style>
