<script lang="ts" setup>
import type { GlobalDomainsResponse } from '@/typescript/interface/common';
import SectionLabel from '@/components/page/signup/SectionLabel.vue';
import MaxCountLabel from '@/components/page/signup/MaxCountLabel.vue';
import WpDropZone from '@/components/global/WpDropzone.vue';
import LinkItem from '@/components/page/signup/LinkItem.vue';
import UserPortfolio from '~/components/page/signup/UserPortfolio.vue';
export interface UserInfo {
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
definePageMeta({
  layout: 'edit'
});
const userInfo = defineModel<UserInfo>('userInfo', { required: true });
const { $get, $post } = useNuxtApp();
const cookieUserName = useCookie('userName');
onMounted(() => {
  if (typeof cookieUserName.value === 'string') {
    userInfo.value.nickname = cookieUserName.value;
  }
});

const linkText = ref<string>('');
interface Domains {
  careers: string[];
  jobs: string[];
  skills: string[];
  subjects: string[];
  workTimes: string[];
  applyStatuses: string[];
}
const domainData = ref<Domains>({
  careers: [],
  jobs: [],
  skills: [],
  subjects: [],
  workTimes: [],
  applyStatuses: []
});
const portfolios = ref<File[]>([]);
const regPrimaryInfoCookie = useCookie('regPrimaryInfo');
// 프로젝트 리스트의 정보 불러오는 API
defineExpose({ userInfo, domainData, portfolios });
const loadGlobalDomains = async () => {
  const getDomains = await $get<GlobalDomainsResponse>('/domains');
  const getDomainsStatus = getDomains.status;
  if (getDomainsStatus === 200) {
    domainData.value = getDomains._data as GlobalDomainsResponse;
    // localStorage.setItem('regPrimaryInfo', 'true');
    regPrimaryInfoCookie.value = String(true);
  }
};
loadGlobalDomains();

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
  console.log(target.value);
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
  if (!domainData.value) return [];
  if (userInfo.value.skills.length) {
    // 이미 선택된 기술 스택 이름을 Set으로 변환
    const alreadySelectedTechStackSet = new Set(userInfo.value.skills);
    // 이미 선택된 기술 스택을 제외한 기술 스택을 필터링
    const filteredTechStack = domainData.value.skills.filter(
      (techName) => !alreadySelectedTechStackSet.has(techName) && techName.toUpperCase().includes(techStackSearchKeyword.value.toUpperCase())
    );

    return filteredTechStack;
  } else {
    return domainData?.value.skills.filter((techName) => techName.toUpperCase().includes(techStackSearchKeyword.value.toUpperCase()));
  }
});
const selectTechStack = (techName: string) => {
  userInfo.value.skills.push(techName);

  if (userInfo.value.skills.includes(techName)) {
    techStackSearchKeyword.value = '';
    return;
  }
  userInfo.value.skills.push(techName);
  techStackSearchKeyword.value = '';
};
const deleteTechStackChip = (techName: string) => {
  const index = getTechStackArrayIndex(techName);
  userInfo.value.skills.splice(index, 1);
};
const techStackSearchKeyword = ref('');
const updateTechStackSearchKeyword = (techStackSearchKeywordChangeEvent: Event) => {
  const changeValue = (techStackSearchKeywordChangeEvent.target as HTMLInputElement).value;

  techStackSearchKeyword.value = changeValue;
};

const updateLinkText = (e: Event) => {
  const target = e.target as HTMLInputElement;
  linkText.value = target.value;
};
const clearTechStackSearchKeyword = () => {
  techStackSearchKeyword.value = '';
};

const addLink = () => {
  if (!userInfo.value.links) {
    userInfo.value.links = [];
  }
  userInfo.value.links.push(linkText.value);
  linkText.value = '';
};
// selectTec
// const selectTechStackList = ref<string[]>([]);
// 기술 이름을 인자로 받아 selectTechStackList 중 위치하는 index 리턴
const getTechStackArrayIndex = (techName: string) => {
  return userInfo.value.skills.findIndex((techStackItem) => techStackItem === techName);
};
const { data, pending, error, refresh, clear } = useAsyncData(
  'register',
  async () => {
    const set = new Set();
    set.add('Vue');
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

// confirm modal
const confirmModalComponentRef = ref();

const updateIntroduceText = (e: Event) => {
  const target = e.target as HTMLInputElement;
  userInfo.value.myInfo = target.value;
};

const workTimeSelect = (list: string) => {
  userInfo.value.workTime = list;
};
const deleteLink = (idx: number) => {
  const links = userInfo.value.links ? userInfo.value.links : [];
  userInfo.value.links = [...links.slice(0, idx), ...links.slice(idx)];
};

const chipClick = (chip: string) => {
  if (userInfo.value.subjects.includes(chip.toString())) {
    const findIndex = userInfo.value.subjects.findIndex((item: string) => item === chip.toString());
    userInfo.value.subjects.splice(findIndex, 1);
  } else {
    userInfo.value.subjects.push(chip.toString());
  }
};
const onDelete = (index: number) => {
  portfolios.value.splice(index, 1);
};

const getRepresentativeImgFromDropzone = async (files: File[]) => {
  if (portfolios.value.length === 5) {
    await confirmModalComponentRef.value.confirmModalShow({
      title: '포트폴리오는 최대 5개까지 등록할 수 있어요',
      subTitle1: '',
      isCancel: false,
      confirmButtonName: '확인'
    });
  }
  // 파일이 중복되어서 들어갈땐?
  const fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  let chkFileType = true;
  files.forEach((file: File) => {
    if (chkFileType !== false) {
      if (!fileTypes.includes(file.type)) {
        chkFileType = false;
      }
    }
  });

  if (chkFileType) {
    portfolios.value.push(...files);
  } else {
    await confirmModalComponentRef.value.confirmModalShow({
      title: '지원하는 파일 형식이 아니에요',
      subTitle1: 'pdf, png, jpg, jpeg 파일로 첨부해주세요',
      isCancel: false,
      confirmButtonName: '확인'
    });
  }
};
</script>

<template>
  <div class="w-[544px] h-[488px] grow mx-auto mt-1 font-semibold flex flex-col">
    <div class="grow flex flex-col gap-[40px] font-medium text-h2-font-size mb-1.5 pt-6 mt-10">
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
                @update:modelValue="() => console.log('adsd')"
                @onKeyDownEnter="onNicknameCheck"
              />
            </ClientOnly>
          </div>
          <ClientOnly>
            <WpButton :disabled="userInfo.nickname.length === 0" class="align-self-stretc" type="filled-neutral-tertiary" size="md" @click="onNicknameCheck"
              ><div class="text-white text-p2-font-size">중복확인</div></WpButton
            >
          </ClientOnly>
        </div>
      </div>
      <div>
        <div class="mb-4">
          <span class="text-h2-font-size">직무 및 연차</span>
        </div>
        <ClientOnly>
          <WpDropdown
            placeholder="직무 선택"
            class="text-p1-font-size font-regular text-black w-full h-[40px] hover:bg-[#11111114] active:bg-[#11111129]"
            :selectList="domainData?.jobs"
            :modelValue="userInfo.job"
            @menuSelect="onJobSelect"
          />
        </ClientOnly>
      </div>
      <div>
        <div class="flex justify-between">
          <div class="text-h2-font-size font-medium">자기소개</div>
          <div class="text-label2-font-size font-regular text-neutral-secondary">0/300</div>
        </div>
        <div class="grow">
          <textarea
            class="border w-full h-[200px] px-3 py-[6px] text-p2-font-size font-regular resize-none rounded-sm"
            :modelValue="userInfo.myInfo"
            @update:model-value="updateIntroduceText"
            placeholder="자기소개를 입력해주세요"
          />
        </div>
      </div>
      <div>
        <div class="flex gap-3 items-center">
          <div class="text-h2-font-size font-medium">관심있는 카테고리</div>
          <div class="text-label2-font-size font-regular text-neutral-secondary">최대 6개까지 등록할 수 있어요</div>
        </div>
        <ClientOnly>
          <div class="flex flex-wrap gap-4 w-full mt-4">
            <template v-for="(subject, idx) in domainData?.subjects" :key="subject">
              <WpChip
                @click="chipClick(subject)"
                class="h-8"
                :class="userInfo.subjects?.includes(subject) ? 'bg-primary-container' : 'bg-neutral-container-secondary'"
                ><div class="p1-font-size font-medium">{{ subject }}</div></WpChip
              >
            </template>
          </div>
        </ClientOnly>
      </div>
      <div>
        <div class="flex mb-4 items-center">
          <span class="text-h2-font-size">기술 스택</span>
          <span class="ml-[12px] font-regular text-label2-font-size text-neutral-tertiary">1개 이상 15개까지 등록할 수 있어요.</span>
          <ClientOnly>
            <MaxCountLabel class="ml-auto" :cur="userInfo.skills.length" :total="15"></MaxCountLabel>
          </ClientOnly>
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
          <ClientOnly>
            <div class="flex flex-wrap pt-4 gap-3">
              <WpTechStackChip
                v-for="techStackItem in userInfo.skills"
                :key="techStackItem"
                @deleteTechStackChip="deleteTechStackChip"
                :techName="techStackItem"
                :isShowClose="true"
              />
            </div>
          </ClientOnly>
        </div>
      </div>
      <div>
        <div class="flex items-center mb-4">
          <div class="text-h1-font-size">작업 투자 가능 시간</div>
          <span class="ml-[12px] font-regular text-label2-font-size text-neutral-tertiary">작업시간은 주간 기준으로 설정해주세요.</span>
        </div>
        <WpDropdown
          :select-list="domainData?.workTimes"
          :model-value="userInfo.workTime"
          @menu-select="workTimeSelect"
          placeholder="선택"
          class="font-regular text-neutral-tertiary"
        />
      </div>
      <div>
        <div class="flex items-center mb-4">
          <div class="text-h1-font-size">포트폴리오</div>
          <SectionLabel>최대 5개까지 등록할 수 있어요.(등록 가능 파일: pdf, png, jpg, jpeg)</SectionLabel>
        </div>
        <WpDropZone class="border w-full" :modelValue="portfolios" :is-icon="false" @update:modelValue="getRepresentativeImgFromDropzone">
          <template #description>
            <div>파일을 드래그 하거나 버튼을 클릭하여 첨부해보세요</div>
          </template>
        </WpDropZone>
        <div class="flex gap-2 mt-2">
          <UserPortfolio class="cursor-pointer" v-for="(file, index) in portfolios" :key="file.name" :file="file" @on-delete="onDelete(index)" />
        </div>
      </div>
      <div>
        <div class="flex items-center">
          <div class="text-h1-font-size">기타 링크</div>
          <span class="ml-[12px] font-regular text-label2-font-size text-neutral-tertiary">최대 5개까지 등록할 수 있어요.</span>
        </div>
        <div class="flex gap-4 mt-4">
          <WpInput
            @on-key-down-enter="addLink"
            :model-value="linkText"
            @update:modelValue="updateLinkText"
            class="h-8 grow"
            placeholder="http://"
            type="text"
          ></WpInput>
          <WpButton @click="addLink" size="sm" type="filled-neutral-tertiary"><div>등록</div></WpButton>
        </div>
        <LinkItem v-for="(userlink, idx) in userInfo.links" :value="userlink" :key="userlink" @onDelete="deleteLink(idx)" />
      </div>
    </div>
  </div>
</template>
