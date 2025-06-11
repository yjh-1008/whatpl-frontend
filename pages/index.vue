<script lang="ts" setup>
import RecentPost from '@/components/page/home/RecentPost.vue';
import ProjectListContainer from '~/components/page/home/ProjectListContainer.vue';
import type { RecruitmentPostList, RecruitmentNotice } from '@/typescript/interface/recruitment';
/* swiper.js */
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Swiper as SwiperClass } from 'swiper';
import { Autoplay } from 'swiper/modules';
import SwiperItem from '@/components/page/home/SwiperItem.vue';
import { mockPopularRecruitmentPostData } from '@/utils/mockProject';
import ProjectCarousel from '@/components/page/home/ProjectCarousel.vue';
const { $get, $patch } = useNuxtApp();
/* swiper.js */
const MAX_POST_SIZE = 4;
const userName = useCookie('userName');
// userL 쿠키값을 가져와 현재 사용자의 로그인 상태를 체크하고, true or false로 리턴한다.
const isLogined = computed(() => {
  const userL = useCookie('userL');

  if (userL.value !== undefined && userL.value !== null) {
    if (userL.value === 'Y') {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
});

const router = useRouter();

// 스와이퍼 버튼 이벤트 핸들러.
const carouselSwiper = ref<SwiperClass>();
const onSwiper = (swiper: SwiperClass) => {
  carouselSwiper.value = swiper;
};

// 인기 프로젝트 로드
const { data: popularRecruitmentPostData, refresh: recruitmentPostDataRefresh } = await useAsyncData(
  'recruitmentPostData',
  async () => {
    const loadRecruitmentPostData = await $get<RecruitmentPostList>('/projects', { page: 0, size: 4, sort: 'popluar' });
    const loadRecruitmentPostDataStatus = loadRecruitmentPostData.status;
    const loadRecruitmentPostDataResult = loadRecruitmentPostData._data;

    if (loadRecruitmentPostDataStatus !== 200) {
      if (loadRecruitmentPostDataResult && isBackendError(loadRecruitmentPostDataResult)) {
        throw showError({ fatal: true, statusCode: Number(loadRecruitmentPostDataResult.code), message: loadRecruitmentPostDataResult.message });
      }
    }

    return loadRecruitmentPostDataResult;
  },
  { server: false }
);
recruitmentPostDataRefresh();

const { data: latestRecruitmentPostData, refresh: latestProjectPostDataRefresh } = await useAsyncData(
  'latestPostData',
  async () => {
    const loadRecruitmentPostData = await $get<RecruitmentPostList>('/projects', { page: latestProjectPage.value, size: 2, sort: 'latest' });
    const loadRecruitmentPostDataStatus = loadRecruitmentPostData.status;
    const loadRecruitmentPostDataResult = loadRecruitmentPostData._data;

    if (loadRecruitmentPostDataStatus !== 200) {
      if (loadRecruitmentPostDataResult && isBackendError(loadRecruitmentPostDataResult)) {
        throw showError({ fatal: true, statusCode: Number(loadRecruitmentPostDataResult.code), message: loadRecruitmentPostDataResult.message });
      }
    }
    if (loadRecruitmentPostDataResult?.list.length !== undefined && typeof loadRecruitmentPostDataResult?.list.length === 'number') {
      totalPageOfLatestProject.value = loadRecruitmentPostDataResult?.list.length;
      return loadRecruitmentPostDataResult;
    }
  },
  { server: false }
);
const latestProjectPage = ref<number>(1);
const totalPageOfLatestProject = ref<number>(0);
// latestProjectPostDataRefresh();
// 슬라이더 정보
const popularSlideIndex = ref<number>(1);
const latestSliderIndex = ref<number>(1);
const sliceLeastPostData = ref<RecruitmentNotice[]>(mockPopularRecruitmentPostData.list.slice(0, 2));
const nextLatestProject = () => {
  latestProjectPage.value = latestProjectPage.value === 4 ? 1 : latestProjectPage.value + 1;
  sliceLeastPostData.value = mockPopularRecruitmentPostData.list.slice(latestProjectPage.value, latestProjectPage.value + 2);
  // await latestProjectPostDataRefresh();
};

const prevtLatesetProject = () => {
  latestProjectPage.value = latestProjectPage.value === 1 ? 4 : latestProjectPage.value - 1;
  sliceLeastPostData.value = mockPopularRecruitmentPostData.list?.slice(latestProjectPage.value, latestProjectPage.value + 2);
  // await latestProjectPostDataRefresh();
};

const slideChangeTransitionStart = (swiper: SwiperClass) => {
  popularSlideIndex.value = swiper.realIndex + 1;
};

const swiperLoop = computed<boolean>(() => {
  if (!popularRecruitmentPostData.value?.list) return false;
  return popularRecruitmentPostData.value?.list.length > 1;
});

const moveToRecruitment = (idx: number) => {
  router.push({ path: '/recruitment/view', query: { id: idx } });
};
</script>

<template>
  <!-- top level outer container -->
  <div class="w-full h-[100vh]">
    <!-- 홈 content container -->
    <div class="w-full h-full flex flex-col">
      <!-- 인기글, 최근 등록 글 container -->
      <div class="flex items-center px-6 pt-6 pb-14 max-w-[1440px] xl:w-full xl:mx-auto gap-4 lg:flex-col xl:flex-row">
        <!-- 인기글 -->
        <div class="flex xl:w-[804px] lg:w-full flex-col gap-y-4 h-[388px]">
          <div class="flex justify-between items-center">
            <p class="text-h1-font-size text-neutral font-semibold">인기 글</p>
            <ClientOnly>
              <ProjectCarousel
                :currentIndex="popularSlideIndex"
                :totalIndex="MAX_POST_SIZE"
                @next="() => carouselSwiper?.slideNext()"
                @prev="() => carouselSwiper?.slidePrev()"
              />
            </ClientOnly>
          </div>
          <!-- 캐러셀 -->
          <div class="flex h-full overflow-y-hidden relative">
            <ClientOnly>
              <Swiper
                class="w-full"
                :loop="swiperLoop"
                :modules="[Autoplay]"
                @swiper="onSwiper"
                @slideChange="slideChangeTransitionStart"
                :autoplay="{
                  delay: 5000,
                  disableOnInteraction: false
                }"
              >
                <SwiperSlide v-for="item in mockPopularRecruitmentPostData?.list" :key="item.projectId">
                  <SwiperItem @click="moveToRecruitment(item.projectId)" :project="item" />
                </SwiperSlide>
              </Swiper>
            </ClientOnly>
          </div>
        </div>
        <!-- 최근 등록 글 -->
        <ClientOnly>
          <div class="flex flex-col lg:w-full grow gap-y-4 h-[388px]">
            <div class="flex justify-between w-full ite ms-center">
              <p class="text-h1-font-size text-neutral font-semibold">최근 등록 글</p>
              <ProjectCarousel :currentIndex="latestProjectPage" :totalIndex="MAX_POST_SIZE" @next="nextLatestProject" @prev="prevtLatesetProject" />
            </div>
            <!-- 최근 등록 글 -->
            <div class="flex flex-col gap-3 jitems-start justify-center self-stretch">
              <RecentPost @click="moveToRecruitment(project.projectId)" v-for="project in sliceLeastPostData" :project="project" :key="project.projectId" />
            </div>
          </div>
        </ClientOnly>
      </div>
      <!-- 프로젝트 리스트 -->
      <ProjectListContainer @click="moveToRecruitment" />
    </div>
  </div>
</template>
