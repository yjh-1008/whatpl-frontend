<script lang="ts" setup>
import type { BackEndBaseResponse } from '@/typescript/interface/common';
import MaxCountLabel from '@/components/page/signup/MaxCountLabel.vue';
import type { TokenRefreshResponse } from '~/typescript/interface/auth';
import WpConfirmModal from '@/components/global/WpConfirmModal.vue';
const { $get, $post } = useNuxtApp();
const userInfo = ref<UserDefaultInfo>({
  nickname: '',
  job: '',
  career: '',
  skills: [],
  profileOpen: true
});
interface Domains {
  careers: string[];
  jobs: string[];
  skills: string[];
  subjects: string[];
  workTimes: string[];
  applyStatuses: string[];
}

const props = withDefaults(
  defineProps<{
    domainData: Domains;
  }>(),
  {
    domainData: () => {
      return {
        careers: [],
        jobs: [],
        skills: [],
        subjects: [],
        workTimes: [],
        applyStatuses: []
      };
    }
  }
);

const router = useRouter();

const disableNextBtn = ref<boolean>(true);
watch(
  () => userInfo.value.nickname,
  () => {
    disableNextBtn.value = true;
  }
);
const dialogState = ref<boolean>(false);
const NICKNAME_PLACEHOLDER = '닉네임을 입력해주세요.';

const checkNickname = async () => {
  let confirmMessage = '';
  let subTitle = '';
  const response = await $get<any>('/members/check-nickname', { nickname: userInfo.value.nickname });

  if (response.status === 200) {
    disableNextBtn.value = false;
    confirmMessage = '사용가능한 닉네임이에요';
  } else {
    confirmMessage = response._data?.message;
    if (response._data?.detailErrors) {
      subTitle = response._data?.detailErrors[0].reason;
    }
  }
  await confirmModalComponentRef.value.confirmModalShow({
    title: confirmMessage,
    subTitle1: subTitle,
    isCancel: false,
    confirmButtonName: '확인'
  });
};

const onUsernameChange = (event: Event) => {
  const target = event.target as HTMLInputElement;

  userInfo.value.nickname = target.value;
};

const onNicknameCheck = async () => {
  let nickname = unref(userInfo.value.nickname);
  // 한, 영, 숫자 사용 가능 중복 불가
  await checkNickname();
  // 닉네임 중복체크 미진행시 가입 불가
};

const onJobSelect = (e: string) => {
  userInfo.value.job = e;
};

const onCareerSelect = (val: string) => {
  userInfo.value.career = val;
};
const filterTechStackList = computed(() => {
  if (selectTechStackList.value.length) {
    // 이미 선택된 기술 스택 이름을 Set으로 변환
    const alreadySelectedTechStackSet = new Set(selectTechStackList.value);

    // 이미 선택된 기술 스택을 제외한 기술 스택을 필터링
    const filteredTechStack = props.domainData.skills.filter(
      (techName) => !alreadySelectedTechStackSet.has(techName) && techName.toUpperCase().includes(techStackSearchKeyword.value.toUpperCase())
    );

    return filteredTechStack;
  } else {
    return props.domainData.skills.filter((techName) => techName.toUpperCase().includes(techStackSearchKeyword.value.toUpperCase()));
  }
});
const selectTechStack = (techName: string) => {
  selectTechStackList.value.push(techName);
  techStackSearchKeyword.value = '';
};
const deleteTechStackChip = (techName: string) => {
  const index = getTechStackArrayIndex(techName);
  selectTechStackList.value.splice(index, 1);
};
const techStackSearchKeyword = ref('');
const updateTechStackSearchKeyword = (techStackSearchKeywordChangeEvent: Event) => {
  const changeValue = (techStackSearchKeywordChangeEvent.target as HTMLInputElement).value;
  techStackSearchKeyword.value = changeValue;
};
const clearTechStackSearchKeyword = () => {
  techStackSearchKeyword.value = '';
};
// selectTec
const selectTechStackList = ref<string[]>([]);
// 기술 이름을 인자로 받아 selectTechStackList 중 위치하는 index 리턴
const getTechStackArrayIndex = (techName: string) => {
  return selectTechStackList.value.findIndex((techStackItem) => techStackItem === techName);
};
const { data, pending, error, refresh, clear } = await useAsyncData(
  'register',
  async () => {
    const response = await $post('/members/required', {
      nickname: userInfo.value.nickname,
      job: userInfo.value.job,
      career: userInfo.value.career,
      skills: userInfo.value.skills,
      profileOpen: userInfo.value.profileOpen
    });
    return response;
  },
  { immediate: false }
);

const onRegister = async () => {
  userInfo.value.skills = selectTechStackList.value;
  await refresh();
  if (error.value) {
    const errData = error.value?.data as BackEndBaseResponse;
    dialogState.value = true;
  } else {
    const userAccessTokenCookie = useCookie('userAccessToken', { secure: true, sameSite: 'strict', maxAge: 1209600 });
    const userRefreshTokenCookie = useCookie('userRefreshToken', { secure: true, sameSite: 'strict', maxAge: 1209600 });
    const userJob = useCookie('userJob', { secure: true, sameSite: 'strict', maxAge: 1209600 });
    const userCar = useCookie('userCar', { secure: true, sameSite: 'strict', maxAge: 1209600 });
    userJob.value = userInfo.value.job;
    userCar.value = userInfo.value.career;
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };
    const requestFormData = new URLSearchParams();
    if (!userRefreshTokenCookie.value) return;

    requestFormData.append('refreshToken', userRefreshTokenCookie.value);
    const requestTokenRefresh = await $post<TokenRefreshResponse>('/token', requestFormData, headers);
    const requestTokenRefreshStatus = requestTokenRefresh.status;
    const requestTokenRefreshResult = requestTokenRefresh._data;
    if (requestTokenRefreshStatus === 200 && requestTokenRefreshResult) {
      userAccessTokenCookie.value = requestTokenRefreshResult?.accessToken;
      userRefreshTokenCookie.value = requestTokenRefreshResult.refreshToken;
      router.push('/signup?step=2');
    } else {
      // '토큰 갱신 중 에러가 발생했습니다::fttr\n다시 로그인 해주세요.'
      confirmModalComponentRef.value.confirmModalShow({
        title: '토큰 갱신 중 에러가 발생했습니다::fttr\n다시 로그인 해주세요.',
        subTitle1: '',
        isCancel: false,
        confirmButtonName: '확인'
      });
    }
  }
};

const validateNextStep = computed<boolean>(() => {
  const { job, career, skills } = unref(userInfo);
  // 닉네임 중복 통과, 모든 값 필수로 입력
  return disableNextBtn.value === false && job !== '' && career !== '' && selectTechStackList.value?.length > 0;
});
// confirm modal
const confirmModalComponentRef = ref();
</script>

<template>
  <div class="w-[544px] h-[488px] grow mx-auto mt-1 font-semibold flex flex-col">
    <div class="text-h1-font-size">왓플과 함께 사이드 프로젝트와 팀원을 구해보세요.</div>
    <div class="grow flex flex-col gap-[40px] mb-1.5 border-t pt-6 mt-10">
      <div>
        <div class="mb-4">
          <span class="text-h2-font-size">닉네임</span>
          <span class="ml-[12px] font-regular text-label2-font-size text-neutral-tertiary">한글, 영문, 숫자를 사용하여 8글자 이내로 설정할 수 있어요</span>
        </div>
        <div class="flex gap-4 w-full justify-between">
          <div class="grow">
            <ClientOnly>
              <WpInput
                :modelValue="userInfo.nickname"
                :placeholder="NICKNAME_PLACEHOLDER"
                type="text"
                class="w-full"
                :maxLength="8"
                @update:modelValue="onUsernameChange"
                @onKeyDownEnter="onNicknameCheck"
              />
            </ClientOnly>
          </div>
          <WpButton :disabled="userInfo.nickname.length === 0" class="align-self-stretc" type="filled-neutral-tertiary" size="md" @click="onNicknameCheck"
            ><div class="text-white text-p2-font-size">중복확인</div></WpButton
          >
        </div>
      </div>
      <div>
        <div class="mb-4">
          <span class="text-h2-font-size">직무 및 연차</span>
        </div>
        <div class="flex gap-[20px] justify-evenly">
          <WpDropdown
            placeholder="직무 선택"
            class="text-p1-font-size font-regular text-black w-full h-[40px] hover:bg-[#11111114] active:bg-[#11111129]"
            :selectList="domainData?.jobs"
            :modelValue="userInfo.job"
            @menuSelect="onJobSelect"
          />
          <WpDropdown
            placeholder="연차 선택"
            class="text-p1-font-size ffont-regular text-black w-full h-[40px] hover:bg-[#11111114] active:bg-[#11111129]"
            :selectList="domainData?.careers"
            :modelValue="userInfo.career"
            @menuSelect="onCareerSelect"
          />
        </div>
      </div>
      <div>
        <div class="flex mb-4 items-center">
          <span class="text-h2-font-size">기술 스택</span>
          <span class="ml-[12px] font-regular text-label2-font-size text-neutral-tertiary">1개 이상 15개까지 등록할 수 있어요.</span>
          <MaxCountLabel class="ml-auto" :cur="selectTechStackList.length" :total="15"></MaxCountLabel>
        </div>
        <div class="flex flex-col">
          <WpTechStackSearchInput
            :searchKeyword="techStackSearchKeyword"
            :techStackList="filterTechStackList"
            placeholder="기술명을 입력해주세요"
            :type="'text'"
            @update:searchKeyword="updateTechStackSearchKeyword"
            @selectTechStack="selectTechStack"
            @clear="clearTechStackSearchKeyword"
          />
          <!-- TECH CHIP -->
          <div class="flex flex-wrap pt-3 gap-3">
            <WpTechStackChip
              v-for="techStackItem in selectTechStackList"
              :key="techStackItem"
              @deleteTechStackChip="deleteTechStackChip"
              :techName="techStackItem"
              :isShowClose="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <ClientOnly>
    <Teleport to="#sign-footer">
      <footer class="w-[100%] h-[100px] bg-white flex justify-center">
        <WpButton @click="onRegister" class="w-[544px] h-[44px] mt-6 mb-8" :disabled="!validateNextStep" type="filled-primary">다음</WpButton>
      </footer>
    </Teleport>
    <Teleport to="body">
      <WpConfirmModal ref="confirmModalComponentRef" />
    </Teleport>
  </ClientOnly>
</template>
