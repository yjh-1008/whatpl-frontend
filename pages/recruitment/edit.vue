<script lang="ts" setup>
import WpChip from '@/components/global/WpChip.vue';
import WpInput from '@/components/global/WpInput.vue';
import WpDropdown from '@/components/global/WpDropdown.vue';
import WpButton from '@/components/global/WpButton.vue';
import JobAndRecruitAmount from '@/components/page/recruitment/JobAndRecruitAmount.vue';
import WpTechStackChip from '@/components/global/WpTechStackChip.vue';
import WpDropZone from '@/components/global/WpDropzone.vue';
import WpTechStackSearchInput from '@/components/global/WpTechStackSearchInput.vue';
import WpToastEdtior from '@/components/global/WpToastEdtior.vue';
import CommonTitle from '@/components/page/recruitment/CommonTitle.vue';
import WpImageCropper from '@/components/global/WpImageCropper.vue';
import WpConfirmModal from '@/components/global/WpConfirmModal.vue';
import type { JobAndRecruitAmountItem, RecruitmentPost } from '@/typescript/interface/recruitment';
import type { GlobalDomainsResponse } from '@/typescript/interface/common';

const { $get } = useNuxtApp();
const { handleClientError } = useErrorHandler();

const runtimeConfig = useRuntimeConfig();
const { backEndBaseUrl } = runtimeConfig.public;

const router = useRouter();
const currentQuery = computed(() => {
  return router.currentRoute.value.query;
});
const { id } = currentQuery.value;

/**
 * 프로젝트명
 */
const projectName = ref('');
const updateProjectName = (projectNameChangeEvent: Event) => {
  const changeValue = (projectNameChangeEvent.target as HTMLInputElement).value;
  projectName.value = changeValue;
};

/**
 * 도메인
 */
const domainTypes = ref<string[]>([]);
const domain = ref('');
const clickDomainChip = (doaminType: string) => {
  domain.value = doaminType;
};
const domainChipDynamicClass = (doaminType: string) => {
  if (domain.value === doaminType) {
    return 'bg-primary-container text-on-primary-container font-medium border border-on-primary-container';
  } else {
    return 'font-regular border-outline-secondary bg-neutral-container-secondary';
  }
};

/**
 * 직군 및 모집인원
 */
const jobAndRecruitAmount = ref<JobAndRecruitAmountItem[]>([]);
const jobs = ref<GlobalDomainsResponse['jobs']>([]);
const isDefaultDropdown = ref(true);

// 현재 선택된 직군을 제외한 직군 리스트를 리턴한다.
const calcJobs = computed(() => {
  const currentSelectJobList = jobAndRecruitAmount.value.map((list) => list.job);
  // A 배열을 Set으로 변환하여 빠르게 검사할 수 있도록 함
  const setA = new Set(currentSelectJobList);
  // B 배열에서 A 배열과 중복되지 않는 항목만 필터링
  const filteredB = jobs.value.filter((el) => !setA.has(el));

  return filteredB;
});
// 이미 선택된 직군이 있을때 직군 변경시
const changeJob = (currentJob: string, selectJob: string) => {
  const index = getJobAndRecruitAmountArrayIndex(currentJob);
  jobAndRecruitAmount.value[index].job = selectJob;
};
const addJobAndRecruitAmount = (job: string) => {
  const jobAndRecruitAmountItem = {
    job: job,
    recruitAmount: 1
  };
  jobAndRecruitAmount.value.push(jobAndRecruitAmountItem);

  isDefaultDropdown.value = false;
};
// job을 인자로 받아 jobAndRecruitAmount 중 위치하는 index 리턴
const getJobAndRecruitAmountArrayIndex = (job: string) => {
  return jobAndRecruitAmount.value.findIndex((el) => el.job === job);
};
const plusRecruitAmount = (job: string) => {
  const index = getJobAndRecruitAmountArrayIndex(job);

  const currentAmount = jobAndRecruitAmount.value[index].recruitAmount;

  if (currentAmount >= 5) {
    alert('직군당 모집인원은 최대 5명까지 가능합니다.');
    jobAndRecruitAmount.value[index].recruitAmount = 5;
  } else {
    jobAndRecruitAmount.value[index].recruitAmount += 1;
  }
};
const minusRecruitAmount = (job: string) => {
  const index = getJobAndRecruitAmountArrayIndex(job);

  const currentAmount = jobAndRecruitAmount.value[index].recruitAmount;

  if (currentAmount === 1) {
    alert('직군당 모집인원은 1명 이상이어야 합니다.');
  } else {
    jobAndRecruitAmount.value[index].recruitAmount -= 1;
  }
};
const deleteJobAndRecruitAmount = (jobAndRecruitAmountItem: JobAndRecruitAmountItem) => {
  const index = getJobAndRecruitAmountArrayIndex(jobAndRecruitAmountItem.job);
  jobAndRecruitAmount.value.splice(index, 1);

  // 마지막 item을 삭제하면 defaultDropdown show
  if (jobAndRecruitAmount.value.length === 0) {
    isDefaultDropdown.value = true;
  }
};
const updateRecruitAmount = (recruitAmountInputEvent: Event, job: string) => {
  try {
    const changeType = recruitAmountInputEvent.target as HTMLInputElement;
    const inputValue = changeType.value;
    const index = getJobAndRecruitAmountArrayIndex(job);

    // 반응형 잃는 문제로, 임시로 조치해놓은 상태임... 나중에 다시 봐야함
    jobAndRecruitAmount.value = [...jobAndRecruitAmount.value];

    if (Number(inputValue) <= 0) {
      jobAndRecruitAmount.value[index].recruitAmount = 1;
      throw '직군당 모집인원은 최소 1명 이상이어야 합니다.';
    } else if (Number(inputValue) > 5) {
      jobAndRecruitAmount.value[index].recruitAmount = 1;
      throw '직군당 모집인원은 최대 5명까지 가능합니다.';
    } else {
      jobAndRecruitAmount.value[index].recruitAmount = Number(inputValue);
    }
  } catch (err) {
    alert(err);
  }
};

/**
 * 작업 진행방식
 */
const workTypes = ref([
  { workTypeKey: 'online', workTypeValue: '온라인' },
  { workTypeKey: 'offline', workTypeValue: '오프라인' },
  { workTypeKey: 'any', workTypeValue: '온・오프라인' }
]);
const work = ref('');
const clickWorkingTypeChip = (workTypeKey: string) => {
  work.value = workTypeKey;
};
const workChipDynamicClass = (workTypeKey: string) => {
  if (work.value === workTypeKey) {
    return 'bg-primary-container text-on-primary-container font-medium border border-on-primary-container';
  } else {
    return 'font-regular border-outline-secondary bg-neutral-container-secondary';
  }
};

/**
 * 기술스택
 */
const techStackList = ref<string[]>([]);
const selectTechStackList = ref<string[]>([]);
// list filtering
const filterTechStackList = computed(() => {
  if (selectTechStackList.value.length) {
    // 이미 선택된 기술 스택 이름을 Set으로 변환
    const alreadySelectedTechStackSet = new Set(selectTechStackList.value);

    // 이미 선택된 기술 스택을 제외한 기술 스택을 필터링
    const filteredTechStack = techStackList.value.filter(
      (techName) => !alreadySelectedTechStackSet.has(techName) && techName.toUpperCase().includes(techStackSearchKeyword.value.toUpperCase())
    );

    return filteredTechStack;
  } else {
    return techStackList.value.filter((techName) => techName.toUpperCase().includes(techStackSearchKeyword.value.toUpperCase()));
  }
});
// selectTechStackList 중 위치하는 index 리턴
const getTechStackArrayIndex = (techName: string) => {
  return selectTechStackList.value.findIndex((techStackItem) => techStackItem === techName);
};
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

/**
 * 대표이미지
 */
const representativeImgFile = ref<File[]>([]);
const representativeImgDataUrl = ref('');
const representativePreviewImgDataUrl = ref('');
const getRepresentativeImgFromDropzone = (imageFile: File[]) => {
  const fileReader = new FileReader();

  fileReader.onload = (event) => {
    if (event.target) {
      if (typeof event.target.result === 'string') {
        representativeImgDataUrl.value = event.target.result;
        isImageCropperVisible.value = true;
      }
    }
  };
  fileReader.readAsDataURL(imageFile[0]);
};
// 이미지 편집기 modal on/off 변수
const isImageCropperVisible = ref(false);

// 이미지 편집 취소
const imageCropCancel = () => {
  representativeImgFile.value = [];
  representativeImgDataUrl.value = '';
  representativePreviewImgDataUrl.value = '';
  isImageCropperVisible.value = false;
};
// 이미지 편집 결과 저장
const saveCropImg = (previewImageDataUrl: string, cropImageFileObject: File[]) => {
  representativePreviewImgDataUrl.value = previewImageDataUrl;
  representativeImgFile.value = cropImageFileObject;
  isImageCropperVisible.value = false;
};
// 편집한 이미지 삭제
const removePreviewImg = () => {
  const confirmResult = confirm('대표이미지를 삭제하시겠습니까?');

  if (!confirmResult) {
    return;
  }

  representativeImgFile.value = [];
  representativeImgDataUrl.value = '';
  representativePreviewImgDataUrl.value = '';
};

/**
 * 프로젝트 목적
 */
const projectGoalTypes = ref([
  { projectGoalKey: true, projectGoalValue: '수익성 프로젝트' },
  { projectGoalKey: false, projectGoalValue: '비수익성 프로젝트' }
]);
const projectGoal = ref<boolean | null>(null);
const clickProjectGoalChip = (projectGoalKey: boolean) => {
  projectGoal.value = projectGoalKey;
};
const projectGoalChipDynamicClass = (projectGoalKey: boolean) => {
  if (projectGoal.value === projectGoalKey) {
    return 'bg-primary-container text-on-primary-container font-medium border border-on-primary-container';
  } else {
    return 'font-regular border-outline-secondary bg-neutral-container-secondary';
  }
};

/**
 * 작업 예상 기간
 */
const projectDeadLine = ref(1);
const updateProjectDeadLine = (projectDeadLineChangeEvent: Event) => {
  const changeValue = (projectDeadLineChangeEvent.target as HTMLInputElement).value;
  projectDeadLine.value = Number(changeValue);
};

/**
 * 프로젝트 설명
 */
const wpToastEditorComponentRef = ref();
const projectDescription = ref();

/**
 * 모집글 수정
 */
const confirmButtonDisabled = false;
const requestConfirmPosting = async () => {
  try {
    const confirmResult = confirm('모집글 수정을 완료하시겠습니까?');

    if (!confirmResult) {
      return;
    }

    const confirmLocation = 'edit';
    const title = projectName.value;
    const subject = domain.value;
    const recruitJobs = jobAndRecruitAmount.value;
    const skills = selectTechStackList.value;
    const content = wpToastEditorComponentRef.value.getEditorContent();
    const profitable = projectGoal.value;
    const meetingType = work.value;
    const term = projectDeadLine.value;
    const representImage = representativeImgFile.value;

    await useRecruitment().confirmPosting(
      confirmLocation,
      title,
      subject,
      recruitJobs,
      skills,
      content,
      profitable,
      meetingType,
      term,
      representImage,
      String(id)
    );
  } catch (err) {
    handleClientError(err);
  }
};

/******************************************************************************************/

/**
 * global domains 조회
 */
const loadGlobalDomains = async () => {
  const getDomains = await $get<GlobalDomainsResponse>('/domains');
  const getDomainsStatus = getDomains.status;

  if (getDomainsStatus === 200) {
    const getDomainsData = getDomains._data;
    if (getDomainsData) {
      // 직군 데이터 바인딩
      jobs.value = getDomainsData.jobs;
      // 도메인 데이터 바인딩
      domainTypes.value = getDomainsData.subjects;
      // 기술스택 데이터 바인딩
      techStackList.value = getDomainsData.skills;
    }
  }
};

/**
 * 모집글 데이터 조회
 */
await useAsyncData(
  async () => {
    const loadRecruitmentPostData = await $get<RecruitmentPost>(`/projects/${id}`);
    const loadRecruitmentPostDataStatus = loadRecruitmentPostData.status;
    const loadRecruitmentPostDataResult = loadRecruitmentPostData._data;

    if (loadRecruitmentPostDataStatus !== 200) {
      if (loadRecruitmentPostDataResult && isBackendError(loadRecruitmentPostDataResult)) {
        throw showError({ fatal: true, statusCode: Number(loadRecruitmentPostDataResult.code), message: loadRecruitmentPostDataResult.message });
      }
    }

    if (loadRecruitmentPostDataResult) {
      projectName.value = loadRecruitmentPostDataResult.title;
      domain.value = loadRecruitmentPostDataResult.subject;
      jobAndRecruitAmount.value = loadRecruitmentPostDataResult.projectJobParticipants;
      work.value = loadRecruitmentPostDataResult.meetingType;
      selectTechStackList.value = loadRecruitmentPostDataResult.skills;

      if (loadRecruitmentPostDataResult.representImageId) {
        representativePreviewImgDataUrl.value = `${backEndBaseUrl}/attachments/${loadRecruitmentPostDataResult.representImageId}/images`;
      }

      projectGoal.value = loadRecruitmentPostDataResult.profitable;
      projectDeadLine.value = loadRecruitmentPostDataResult.term;
      projectDescription.value = loadRecruitmentPostDataResult.content;

      return loadRecruitmentPostDataResult;
    }
  },
  { server: false }
);

// confirm modal
const confirmModalComponentRef = ref();

// 라우팅 방지
const route = useRoute();
router.beforeEach(async (to, from, next) => {
  if (from.fullPath === route.fullPath) {
    const modalResult = await confirmModalComponentRef.value.confirmModalShow({
      title: '작성이 완료되지 않았습니다',
      subTitle1: '저장되지 않은 내용은 사라져요',
      isCancel: true,
      confirmButtonName: '나가기'
    });

    if (!modalResult) {
      next(false);
      return;
    }

    next();
  } else {
    next();
  }
});
// 브라우저 종료, 새로고침 방지
const beforeUnload = (e: Event) => {
  e.preventDefault();
};
onMounted(() => {
  window.addEventListener('beforeunload', beforeUnload);
});
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', beforeUnload);
});

loadGlobalDomains();
</script>

<template>
  <!-- Image Cropper -->
  <!-- v-if를 사용해 조건부 렌더링해야함...이미지 데이터가 있어야 인스턴스가 정상 생성됨 -->
  <WpImageCropper
    v-if="representativeImgDataUrl"
    :isVisible="isImageCropperVisible"
    :originalImg="representativeImgDataUrl"
    @cancel="imageCropCancel"
    @save="saveCropImg"
  />

  <WpConfirmModal ref="confirmModalComponentRef" />

  <!-- top level outer container -->
  <div class="flex flex-col pt-10 pb-[232px] items-center">
    <!-- recruitment content container, max-sm 사이즈는 고려하지 않기로 했지만, 신경 쓰여 임시로 설정해둔 것 -->
    <div class="flex flex-col gap-y-[56px] z-10 w-[922px] md:w-[874px] md:px-6 sm:w-[592px] max-sm:px-[250px]">
      <!-- 프로젝트명 container -->
      <div class="flex flex-col">
        <CommonTitle
          titleName="프로젝트 명"
          :required="true"
          descriptionContent="3글자 이상, 20글자 이하로 작성할 수 있어요"
          tipContent="제목만으로도 어떤 프로젝트인지 유추가 가능하도록 직관적으로 작성해주시면 클릭률을 올릴 수 있어요"
        />
        <!-- Input -->
        <div class="flex pt-4">
          <WpInput :modelValue="projectName" @update:modelValue="updateProjectName" :type="'text'" class="w-full" />
        </div>
      </div>

      <!-- 도메인 container -->
      <div class="flex flex-col">
        <CommonTitle titleName="도메인" :required="true" descriptionContent="도메인은 최대 1개까지 설정할 수 있어요" />
        <!-- Chip Wrapper -->
        <div class="flex flex-wrap pt-4 gap-4">
          <WpChip @click="clickDomainChip(dom)" v-for="dom in domainTypes" :key="dom" :class="domainChipDynamicClass(dom)"> {{ dom }}</WpChip>
        </div>
      </div>

      <!-- 직군 및 모집인원 Cotainer -->
      <div class="flex flex-col">
        <CommonTitle titleName="직군 및 모집인원" :required="true" descriptionContent="직군당 최대 5명까지 설정할 수 있어요" />

        <!-- 직군 및 모집인원 Content Container -->
        <div class="pt-4">
          <JobAndRecruitAmount
            v-for="jobAndRecruitAmountItem in jobAndRecruitAmount"
            :key="jobAndRecruitAmountItem.job"
            @plusRecruitAmount="plusRecruitAmount"
            @minusRecruitAmount="minusRecruitAmount"
            @deleteJobAndRecruitAmount="deleteJobAndRecruitAmount(jobAndRecruitAmountItem)"
            @menuSelect="(job: string) => changeJob(jobAndRecruitAmountItem.job, job)"
            :job="jobAndRecruitAmountItem.job"
            :recruitAmount="jobAndRecruitAmountItem.recruitAmount"
            :selectList="calcJobs"
            @update:recruitAmount="updateRecruitAmount"
          />

          <!-- Default Dropdown Wrapper -->
          <div class="flex justify-between pb-3" v-if="isDefaultDropdown">
            <WpDropdown :placeholder="'선택'" @menuSelect="addJobAndRecruitAmount" :selectList="calcJobs" class="w-[217px] h-8" />
          </div>

          <!-- 직군 추가 버튼 Container -->
          <div class="flex pt-3">
            <button class="flex items-center" @click="() => (isDefaultDropdown = true)">
              <div class="flex">
                <img src="/img/icons/plus.svg" />
              </div>
              <div class="flex text-neutral-secondary font-medium text-p2-font-size pl-1">직군 추가</div>
            </button>
          </div>
        </div>
      </div>

      <!-- 작업 진행방식 -->
      <div class="flex flex-col">
        <CommonTitle titleName="작업 진행방식" :required="true" />

        <div class="flex items-center pt-4">
          <div class="flex gap-4">
            <WpChip
              @click="clickWorkingTypeChip(workType.workTypeKey)"
              v-for="workType in workTypes"
              :key="workType.workTypeKey"
              :class="workChipDynamicClass(workType.workTypeKey)"
            >
              {{ workType.workTypeValue }}
            </WpChip>
          </div>
        </div>
      </div>

      <!-- 기술 스택 -->
      <div class="flex flex-col">
        <div class="flex flex-col">
          <CommonTitle titleName="기술 스택" :required="true" descriptionContent="1개 이상 15개까지 설정할 수 있어요" />

          <div class="flex flex-col pt-4">
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

      <!-- 대표 이미지 -->
      <div class="flex flex-col">
        <CommonTitle
          titleName="대표 이미지"
          descriptionContent="PNG, JPG, JPEG 포맷으로 첨부할 수 있어요"
          tipContent="대표이미지는 16:9 비율로 최적화 되어있어요"
        />

        <!-- DropZone -->
        <div v-if="!representativePreviewImgDataUrl" class="flex mt-4 h-[148px]">
          <WpDropZone :modelValue="representativeImgFile" :is-icon="true" @update:modelValue="getRepresentativeImgFromDropzone" class="w-full">
            <template #icon>
              <img src="/img/icons/image.svg" class="w-6 h-6" />
            </template>
            <template #description>
              <div>사진을 드래그 하거나 버튼을 클릭하여 올려보세요</div>
            </template>
          </WpDropZone>
        </div>

        <!-- Preview Image -->
        <div v-else class="flex flex-col mt-4">
          <div class="flex border border-outline-secondary p-2 w-1/2">
            <img :src="representativePreviewImgDataUrl" class="w-full h-[216px]" />
          </div>
          <div class="flex items-center pt-3">
            <div class="flex items-center cursor-pointer rounded hover:bg-[#11111114] active:bg-[#11111129]" @click="removePreviewImg">
              <img src="/img/icons/trashcan.svg" class="pr-1" />
              <div class="font-medium text-p2-font-size text-neutral-secondary">사진 삭제</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 프로젝트 목적 -->
      <div class="flex flex-col">
        <CommonTitle
          titleName="프로젝트 목적"
          :required="true"
          tipContent="수익성 프로젝트란, 수익을 목적으로 진행하는 프로젝트를 의미해요(스타트업, 창업, 외주 등)"
        />

        <!-- Chip -->
        <div class="flex gap-4 pt-4">
          <WpChip
            @click="clickProjectGoalChip(projectGoalType.projectGoalKey)"
            v-for="projectGoalType in projectGoalTypes"
            :key="projectGoalType.projectGoalValue"
            :class="projectGoalChipDynamicClass(projectGoalType.projectGoalKey)"
          >
            {{ projectGoalType.projectGoalValue }}
          </WpChip>
        </div>
      </div>

      <!-- 작업 예상 기간 -->
      <div class="flex flex-col">
        <CommonTitle titleName="작업 예상 기간" :required="true" descriptionContent="작업 예상 기간은 최대 30개월까지 설정할 수 있어요" />

        <div class="flex items-center gap-3 text-neutral-tertiary pt-4">
          <div>모집 마감 이후</div>
          <div class="flex">
            <div class="flex">
              <WpInput
                :modelValue="projectDeadLine"
                @update:modelValue="updateProjectDeadLine"
                :type="'number'"
                class="h-8 number-input-arrow-hide w-[102px] text-center text-neutral"
              />
            </div>
          </div>
          <div>개월</div>
        </div>
      </div>

      <!-- 프로젝트 설명 -->
      <div class="flex flex-col" v-if="projectDescription">
        <CommonTitle titleName="프로젝트 설명" :required="true" tipContent="오픈카톡, 구글폼 등 기타 지원 방식의 링크 첨부는 무통보 삭제조치 될 수 있어요" />

        <!-- Editor -->
        <div class="flex pt-4 w-full">
          <WpToastEdtior height="60vh" :content="projectDescription" ref="wpToastEditorComponentRef" />
        </div>
      </div>
    </div>
  </div>

  <!-- confirm-button container -->
  <div class="flex flex-col w-full fixed bottom-0 bg-backround z-20">
    <!-- divider -->
    <div class="border-t border-outline"></div>

    <!-- confirm button container -->
    <div class="flex flex-col items-center">
      <div class="text-p2-font-size text-center text-neutral-secondary pt-6 pb-4 w-[624px] md:w-[720px]">
        게시물의 성격에 맞지 않는 내용 또는 부적절한 내용이 포함될 경우<br class="hidden max-sm:inline" />
        운영자 판단 하에 통보 없이 삭제 될 수 있습니다.
      </div>

      <!-- max-sm 사이즈는 고려하지 않기로 했지만, 신경 쓰여 임시로 설정해둔 것 -->
      <div class="pb-6 w-[1156px] md:w-[874px] md:px-6 sm:w-[592px] max-sm:w-[350px]">
        <WpButton @click="requestConfirmPosting" :disabled="confirmButtonDisabled" class="w-full"> 수정 </WpButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
