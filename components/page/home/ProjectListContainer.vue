<script lang="ts" setup>
import DefaultProjectPost from '@/components/page/home/DefaultProjectPost.vue';
import DomainFilterDropdown from '@/components/page/home/DomainFilterDropdown.vue';
import type { GlobalDomainsResponse } from '~/typescript/interface/common';
import type { RecruitmentPostList, RecruitmentNotice } from '@/typescript/interface/recruitment';
import { watch } from 'vue';
let regPrimaryInfoCookie = useCookie('regPrimaryInfo');

// 프로젝트 정렬 기준
const projectListSortMenu = ref(['최신 순', '인기 순']);
const projectListSort = ref('최신 순');
const toggleProfiltability = ref<boolean>(false);
const showProfitInfo = ref<boolean>(false);
// 프로젝트 리스트 탭 메뉴
const projectListTabMenu = ref(['전체', '모집 중']);
const projectListTab = ref('전체');
const { $get } = useNuxtApp();
const domain = ref<string>('');
const job = ref<string>('');
const skill = ref<string>('');
const projectSearchKeyword = ref('');
const projectListPage = ref<number>(0);
const emits = defineEmits<{
  (e: 'click', id: number): void;
}>();
// 프로젝트 리스트의 정보 불러오는 API
const domains = ref<GlobalDomainsResponse>();
const loadGlobalDomains = async () => {
  const getDomains = await $get<GlobalDomainsResponse>('/domains');
  const getDomainsStatus = getDomains.status;
  if (getDomainsStatus === 200) {
    domains.value = getDomains._data;
    regPrimaryInfoCookie.value = String(true);
  }
};

watch([toggleProfiltability, projectListSort, projectListTab, projectSearchKeyword, domain, job, skill], () => {
  filterProjectRefresh();
});

loadGlobalDomains();
const updateSearchText = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target) {
    projectSearchKeyword.value = target.value;
  }
};
// 프로젝트 검색 정보
const projectPage = ref<number>(1);
const getProjects = async (params?: object): Promise<RecruitmentPostList> => {
  const loadRecruitmentPostData = await $get<RecruitmentPostList>('/projects', { page: projectPage.value, size: 2, params });
  const loadRecruitmentPostDataStatus = loadRecruitmentPostData.status;
  const loadRecruitmentPostDataResult = loadRecruitmentPostData._data as RecruitmentPostList;
  if (loadRecruitmentPostDataStatus !== 200) {
    if (loadRecruitmentPostDataResult && isBackendError(loadRecruitmentPostDataResult)) {
      throw showError({ fatal: true, statusCode: Number(loadRecruitmentPostDataResult.code), message: loadRecruitmentPostDataResult.message });
    }
  }
  // if (loadRecruitmentPostDataResult?.pageSize !== undefined && typeof loadRecruitmentPostDataResult?.pageSize === 'number') {
  //   totalPageOfLatestProject.value = loadRecruitmentPostDataResult.pageSize;
  // }
  return loadRecruitmentPostDataResult;
};
const { data: filterProjectList, refresh: filterProjectRefresh } = await useAsyncData(
  'projectList',
  async () => {
    let sortType = 'latest';
    if (projectListSort.value === projectListSortMenu.value[1]) sortType = 'popular';
    const projects = await getProjects({
      page: projectListPage.value,
      size: 4,
      subject: domain.value,
      job: job.value,
      skill: skill.value,
      profitable: toggleProfiltability.value,
      keywoard: projectSearchKeyword.value,
      projectStatus: projectListTab.value === '전체' ? 'ALL' : 'RECRUITING',
      sort: projectListSort.value === '최신 순' ? 'latest' : 'popular'
    });
    return projects;
  },
  { server: false }
);

// 인피니티 스크롤
const infinityScrollRef = ref<HTMLElement | null>(null);
const mainRef = ref<HTMLElement | null>(null);
const moveScroll = ref<boolean>(false);

const moveToTop = () => {
  if (mainRef.value) {
    mainRef.value.scrollTop = 0;
  }
};
const rootEl = computed<HTMLElement>(() => document.documentElement);
const init = () => {
  window.addEventListener('scroll', () => {
    moveScroll.value = rootEl.value.scrollTop > 0;
  });
};

onMounted(() => {
  init();
  mainRef.value = document.querySelector('html');
});

onBeforeRouteLeave(() => {
  window.removeEventListener('scroll', () => {});
});
</script>

<template>
  <div class="flex flex-col items-center xl:w-full xl:grow">
    <div class="flex flex-col px-6 w-full max-w-[1392px] justify-between">
      <p class="text-h1-font-size text-neutral font-semibold w-full">프로젝트 리스트</p>
      <div class="flex pt-4 w-full items-center justify-between">
        <!-- tab -->
        <div class="flex">
          <WpTab :tabMenu="projectListTabMenu" :modelValue="projectListTab" @update:modelValue="(tabName: string) => (projectListTab = tabName)" />
        </div>
        <!-- search input -->
        <div class="flex gap-x-3 pb-[11px]">
          <WpSearchInput :modelValue="projectSearchKeyword" @update:modelValue="updateSearchText" placeholder="검색어를 입력해주세요" class="h-7 w-[294px]" />
          <WpDropdown
            :modelValue="projectListSort"
            @menuSelect="(sortType: string) => (projectListSort = sortType)"
            :selectList="projectListSortMenu"
            class="w-[120px]"
          />
        </div>
      </div>
    </div>
    <div class="bg-neutral-container w-full grow">
      <!-- header  -->
      <div class="max-w-[1392px] justify-center 2xl:mx-auto px-6 py-6 flex-col flex mx-auto">
        <div class="flex gap-4 items-center">
          <DomainFilterDropdown
            v-model="domain"
            @menuSelect="(item) => (domain = item)"
            :selectList="domains?.subjects"
            title="도메인을 1개 선택하세요"
            placeholder="선택"
          >
            <div class="text-label1-font-size font-regular text-neutral-secondary">도메인</div>
          </DomainFilterDropdown>
          <DomainFilterDropdown v-model="job" @menuSelect="(item) => (job = item)" :selectList="domains?.jobs" title="직군을 1개 선택하세요" placeholder="선택">
            <div class="text-label1-font-size font-regular text-neutral-secondary">직군</div>
          </DomainFilterDropdown>
          <DomainFilterDropdown
            v-model="skill"
            @menu-select="(item) => (skill = item)"
            :selectList="domains?.skills"
            :append-icon="true"
            title="기술 스택을 1개 선택하세요"
            placeholder="선택"
          >
            <div class="text-label1-font-size font-regular text-neutral-secondary">기술스택</div>
          </DomainFilterDropdown>
          <div class="flex gap-1 items-center">
            <WpChip @click="toggleProfiltability = !toggleProfiltability" :class="!toggleProfiltability ? 'bg-white' : '!bg-green-80'">
              <div class="flex gap-2 px-2">
                <img class="w-5 h-5" src="/public/img/icons/won.svg" />
                <div class="text-on-primary-container">수익성</div>
              </div>
            </WpChip>
            <div class="relative">
              <img
                @mouseenter="showProfitInfo = true"
                @mouseout="showProfitInfo = false"
                class="w-5 h-5 cursor-pointer"
                src="/public/img/icons/circle-question.svg"
              />
              <div
                v-show="showProfitInfo"
                class="absolute h-9 top-6 bg-white z-20 border rounded shadow-domain-filter-box-shadow text-label1-font-size font-regular text-neutral-secondary w-[216px] p-2"
              >
                수익을 목적으로 하는 프로젝트입니다.
              </div>
            </div>
          </div>
        </div>

        <!-- list (인피니티 스크롤) -->
        <div id="infinityScroll" class="xl:grid xl:grid-cols-2 lg:flex grow mt-6 gap-5 lg:gap-4 flex-wrap">
          <DefaultProjectPost
            v-for="project in mockPopularRecruitmentPostData?.list"
            @click="() => emits('click', project.projectId)"
            id="scrollItem"
            :key="project.projectId"
            :project="project"
          />
        </div>
        <div ref="infinityScrollRef"></div>
      </div>
    </div>
    <img
      v-show="moveScroll"
      @click="moveToTop"
      src="/public/img/icons/arrow up.svg"
      class="w-12 h-12 bg-top-btn right-6 cursor-pointer bottom-6 fixed left inline-flex p-3 rounded-full itens-start justify-center flex-col"
    />
  </div>
</template>

<style></style>
