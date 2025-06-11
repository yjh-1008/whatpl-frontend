<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import WpPopularBadge from '@/components/global/WpPopularBadge.vue';
import WpUserAvater from '@/components/global/WpUserAvater.vue';
import WpButton from '@/components/global/WpButton.vue';
import WpToastViewer from '@/components/global/WpToastViewer.vue';
import WpTechStackChip from '@/components/global/WpTechStackChip.vue';
import WpInput from '@/components/global/WpInput.vue';
import Comment from '@/components/page/recruitment/Comment.vue';
import WpProfitableBadge from '@/components/global/WpProfitableBadge.vue';
import ParticipantsManageModal from '@/components/page/recruitment/ParticipantsManageModal.vue';
import WpConfirmModal from '@/components/global/WpConfirmModal.vue';
import ParticipantsAvater from '@/components/page/recruitment/ParticipantsAvater.vue';
import type { RecruitmentPostComments, RecruitmentPost, RecruitmentPostProjectJobParticipantItem } from '@/typescript/interface/recruitment';

const { $get, $post, $cDelete, $put } = useNuxtApp();
const { handleClientError } = useErrorHandler();
const { applyOrOffer } = useRecruitment();

const dayjs = useDayjs();

const userName = useCookie('userName', { default: () => '' });

const router = useRouter();
const currentQuery = computed(() => {
  return router.currentRoute.value.query;
});
const { id } = currentQuery.value;

// 댓글
const commentInput = ref('');
const updateCommentInput = (commentInputChangeEvent: Event) => {
  const changeValue = (commentInputChangeEvent.target as HTMLInputElement).value;
  commentInput.value = changeValue;
};
const createComments = async () => {
  try {
    if (!commentInput.value) {
      throw '댓글 내용을 입력해주세요!';
    }

    const modalResult = await confirmModalComponentRef.value.confirmModalShow({
      title: '댓글을 등록하시겠습니까?',
      subTitle1: '',
      isCancel: true,
      confirmButtonName: '등록'
    });

    if (!modalResult) {
      return;
    }

    const createCommentsBody = {
      content: commentInput.value
    };

    const requestCreateComments = await $post(`/projects/${id}/comments`, createCommentsBody);
    const requestCreateCommentsStatus = requestCreateComments.status;
    const requestCreateCommentsResult = requestCreateComments._data;

    if (requestCreateCommentsStatus !== 204) {
      throw requestCreateCommentsResult;
    }

    await recruitmentPostCommentsDataRefresh();
    commentInput.value = '';
  } catch (err) {
    console.log(err);
    handleClientError(err);
  }
};

// 모집현황
const currentProjectJobParticipant = ref<RecruitmentPostProjectJobParticipantItem | null>(null);
const selectProjectJobParticipant = (projectJobParticipant: RecruitmentPostProjectJobParticipantItem) => {
  currentProjectJobParticipant.value = { ...projectJobParticipant };
};
const generateWaitingMessage = (job: string) => {
  let ment = '';

  switch (job) {
    case '기획': {
      ment = '기획자님을 기다리고 있어요';
      break;
    }
    case 'PM': {
      ment = '프로젝트매니저님을 기다리고 있어요';
      break;
    }
    case '디자인': {
      ment = '디자이너님을 기다리고 있어요';
      break;
    }
    case '프론트엔드': {
      ment = '프론트엔드 개발자님을 기다리고 있어요';
      break;
    }
    case '백엔드': {
      ment = '백엔드 개발자님을 기다리고 있어요';
      break;
    }
    case 'Android': {
      ment = 'Android 개발자님을 기다리고 있어요';
      break;
    }
    case 'iOS': {
      ment = 'iOS 개발자님을 기다리고 있어요';
      break;
    }

    default: {
      break;
    }
  }

  return ment;
};

// vertical-dots 아이콘 클릭시 모집글 수정 or 삭제 모달 on/off 변수
const isEditOrDeleteModal = ref(false);
// 모집글 수정 or 삭제 모달 외부 영역 클릭시 close 처리
const editOrDeleteModalDivRef = ref(null);
onClickOutside(editOrDeleteModalDivRef, (event: PointerEvent) => {
  isEditOrDeleteModal.value = false;
});
const postEditOrDelete = async (menuType: string) => {
  if (menuType === 'edit') {
    return navigateTo({ path: '/recruitment/edit', query: { id: id } });
  } else {
    // 모집글 삭제 confirm 모달 발생시키기

    const modalResult = await confirmModalComponentRef.value.confirmModalShow({
      title: '모집글을 삭제할까요?',
      subTitle1: '',
      isCancel: true,
      confirmButtonName: '삭제'
    });

    if (!modalResult) {
      return;
    }

    console.log('삭제 로직');
  }
};

// 참여자 관리
const isParticipantsManageModal = ref(false);
const completeKickoutParticipantAction = async () => {
  isParticipantsManageModal.value = false;
  await recruitmentPostDataRefresh();
};

// confirm modal
const confirmModalComponentRef = ref();

// 지원하기
const recruitmentApply = async () => {
  try {
    if (!currentProjectJobParticipant.value) {
      throw '지원하고자 하는 직군을 선택해주세요!';
    } else {
      const applyModalResult = await confirmModalComponentRef.value.confirmModalShow({
        title: '프로젝트에 지원할까요?',
        subTitle1: `[${recruitmentPostData.value?.title}]`,
        subTitle2: `직무: ${currentProjectJobParticipant.value.job}`,
        isCancel: true,
        confirmButtonName: '지원'
      });

      if (!applyModalResult) {
        return;
      }

      await applyOrOffer('APPLY', String(id), currentProjectJobParticipant.value.job);
    }
  } catch (err) {
    handleClientError(err);
  }
};

// 마감하기
const recruitmentClose = async () => {
  const modalResult = await confirmModalComponentRef.value.confirmModalShow({
    title: '모집글을 마감할까요?',
    subTitle1: '',
    isCancel: true,
    confirmButtonName: '마감'
  });

  if (!modalResult) {
    return;
  }

  console.log('마감 로직 시작');
};

// 끌어올리기
const movePostToTop = async () => {
  const modalResult = await confirmModalComponentRef.value.confirmModalShow({
    title: '모집글을 끌어올렸어요',
    subTitle1: '',
    isCancel: false,
    confirmButtonName: '확인'
  });

  if (!modalResult) {
    return;
  }

  console.log('마감 로직 시작');
};

// 프로젝트 좋아요 or 취소
const postLike = async (isFill: boolean) => {
  try {
    // 좋아요 취소
    if (isFill) {
      const requestPostLikeCancel = await $cDelete(`/projects/${id}/likes`);
      const requestPostLikeCancelStatus = requestPostLikeCancel.status;
      const requestPostLikeCancelResult = requestPostLikeCancel._data;

      if (requestPostLikeCancelStatus !== 204) {
        throw requestPostLikeCancelResult;
      }
    }
    // 좋아요 등록
    else {
      const postLikeBody = {
        projectId: id
      };

      const requestPostLike = await $put(`/projects/${id}/likes`, postLikeBody);
      const requestPostLikeStatus = requestPostLike.status;
      const requestPostLikeResult = requestPostLike._data;

      if (requestPostLikeStatus !== 200) {
        throw requestPostLikeResult;
      }
    }

    await recruitmentPostDataRefresh();
  } catch (err) {
    handleClientError(err);
  }
};

// 모집글 데이터 조회
const {
  data: recruitmentPostData,
  pending: recruitmentPostDataPending,
  error: recruitmentPostDataError,
  refresh: recruitmentPostDataRefresh
} = await useAsyncData(
  'recruitmentPostData',
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
      let setRecruitmentPostData = { ...loadRecruitmentPostDataResult };

      // 작성일 포맷 변경
      setRecruitmentPostData.createdAt = dayjs(setRecruitmentPostData.createdAt).format('YYYY-MM-DD');

      // 작업 진행 방식 데이터셋 변경
      if (setRecruitmentPostData.meetingType === 'online') {
        setRecruitmentPostData.meetingType = '온라인';
      } else if (setRecruitmentPostData.meetingType === 'offline') {
        setRecruitmentPostData.meetingType = '오프라인';
      } else {
        setRecruitmentPostData.meetingType = '온・오프라인';
      }

      // TEST
      /*  setRecruitmentPostData.projectJobParticipants[0].participants = [
        { participantId: 1, memberId: 1001, job: '백엔드', nickname: '다람이1', career: '5년차' },
        { participantId: 2, memberId: 1002, job: '프론트엔드', nickname: '다람이2', career: '취업 준비중' },
        { participantId: 3, memberId: 1003, job: 'PM', nickname: '다람이3', career: '3년차' },
        { participantId: 3, memberId: 1004, job: '디자인', nickname: '다람이3', career: '3년차' },
        { participantId: 3, memberId: 1005, job: '기획', nickname: '다람이3', career: '3년차' }
      ]; */

      // 모집글 작성자가 본인인지 타인인지 구분하기 위한 구분값 대입
      if (setRecruitmentPostData.writerNickname === userName.value) {
        setRecruitmentPostData.isWrittenByMe = true;
      } else {
        setRecruitmentPostData.isWrittenByMe = false;
      }

      // TEST
      // setRecruitmentPostData.isWrittenByMe = false;

      // TEST
      // setRecruitmentPostData.isWrittenByMe = true;

      return setRecruitmentPostData;
    }
  },
  { server: false }
);

// 모집글에 등록된 댓글 조회
const {
  data: recruitmentPostCommentsData,
  pending: recruitmentPostCommentsDataPending,
  error: recruitmentPostCommentsDataError,
  refresh: recruitmentPostCommentsDataRefresh
} = await useAsyncData(
  async () => {
    const loadRecruitmentPostCommentsData = await $get<RecruitmentPostComments>(`/projects/${id}/comments`);
    const loadRecruitmentPostCommentsDataStatus = loadRecruitmentPostCommentsData.status;
    const loadRecruitmentPostCommentsDataResult = loadRecruitmentPostCommentsData._data;

    if (loadRecruitmentPostCommentsDataStatus !== 200) {
      if (loadRecruitmentPostCommentsDataResult && isBackendError(loadRecruitmentPostCommentsDataResult)) {
        throw showError({
          fatal: true,
          statusCode: Number(loadRecruitmentPostCommentsDataResult.code),
          message: loadRecruitmentPostCommentsDataResult.message
        });
      }
    }

    return loadRecruitmentPostCommentsDataResult;
  },
  { server: false }
);
</script>
<template>
  <!-- top level outer container -->
  <div class="flex flex-col items-center pb-10" v-if="recruitmentPostData">
    <!-- Confirm Modal -->
    <WpConfirmModal ref="confirmModalComponentRef" />

    <!-- 참여자 관리 모달 -->
    <ParticipantsManageModal
      :isVisible="isParticipantsManageModal"
      :projectId="String(id)"
      :projectJobParticipants="recruitmentPostData.projectJobParticipants"
      @close="isParticipantsManageModal = false"
      @completeKickoutParticipantAction="completeKickoutParticipantAction"
    />

    <!-- view inner content container -->
    <div class="flex flex-col w-[922px] md:w-[874px] md:px-6 sm:w-[592px]">
      <!-- header content container -->
      <div class="flex flex-col pt-10 w-full">
        <!-- 도메인・인기 뱃지・좋아요 아이콘 container-->
        <div class="flex items-center justify-between w-full">
          <div class="flex flex-row gap-2">
            <div class="text-gray-50">[{{ recruitmentPostData.subject }}]</div>
            <WpPopularBadge />
            <WpProfitableBadge v-if="recruitmentPostData.profitable" />
          </div>
          <div class="flex" v-if="!recruitmentPostData.isWrittenByMe">
            <img src="/img/icons/like.svg" class="cursor-pointer" v-if="!recruitmentPostData.myLike" @click="postLike(false)" />
            <img src="/img/icons/like-fill.svg" class="cursor-pointer" v-else @click="postLike(true)" />
          </div>
          <div class="flex items-center gap-x-3" v-else>
            <WpButton size="xs" type="filled-primary" @click="recruitmentClose">마감하기</WpButton>
            <WpButton size="xs" type="filled-primary-container" @click="movePostToTop">끌어올리기</WpButton>

            <!-- 모집글 수정 or 삭제 icon and modal-->
            <div class="flex relative">
              <img src="/img/icons/vertical-dots.svg" class="cursor-pointer" @click="isEditOrDeleteModal = !isEditOrDeleteModal" />
              <div
                ref="editOrDeleteModalDivRef"
                v-if="isEditOrDeleteModal"
                class="flex flex-col font-normal absolute w-[90px] h-[64px] justify-center bg-backround top-8 z-[300] right-1 py-1 text-center shadow-recuritment-post-edit-or-delete-popup-box-shadow rounded"
              >
                <p class="text-p2-font-size cursor-pointer hover:bg-[#11111114]" @click="postEditOrDelete('edit')">모집글 수정</p>
                <p class="text-p2-font-size cursor-pointer hover:bg-[#11111114]" @click="postEditOrDelete('delete')">모집글 삭제</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 프로젝트명 Wrapper -->
        <div class="flex pt-3">
          <p class="text-neutral text-h1-font-size font-medium">{{ recruitmentPostData.title }}</p>
        </div>

        <!-- 유저 아바타, 모집글 관련 정보(조회수,작성일 등) wrapper -->
        <div class="flex items-center pt-6">
          <div class="flex items-center">
            <WpUserAvater class="w-6 h-6" />
            <label class="text-label1-font-size pl-2 text-neutral">{{ recruitmentPostData.writerNickname }} </label>
          </div>

          <div class="flex gap-x-3 pl-6 text-label1-font-size text-gray-70">
            <div class="flex items-center gap-x-2">
              <div>작성일</div>
              <div>
                {{ recruitmentPostData.createdAt }}
              </div>
            </div>

            <div class="flex items-center gap-x-2">
              <div>조회수</div>
              <div>
                {{ recruitmentPostData.views }}
              </div>
            </div>

            <div class="flex items-center gap-x-2">
              <div>댓글 수</div>
              <div>
                {{ recruitmentPostCommentsData?.comments.length === 0 ? 0 : recruitmentPostCommentsData?.comments.length }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- divider -->
      <div class="border-t border-outline mt-4 mb-4"></div>

      <!-- posting content container -->
      <div class="flex flex-col w-full gap-y-10">
        <!-- 모집현황 content container -->
        <div class="flex w-full flex-col">
          <!-- 지원하기 버튼 content container -->
          <div class="flex justify-between items-center">
            <p class="text-h3-font-size font-medium text-neutral">모집현황</p>

            <!-- recruit button or recruit manage button container -->
            <div class="flex items-center gap-3 justify-end" v-if="!recruitmentPostData.isWrittenByMe">
              <label class="text-p2-font-size text-neutral-secondary">
                선택 직군 :
                <span class="text-p2-font-size text-neutral-secondary" v-if="currentProjectJobParticipant">{{ currentProjectJobParticipant.job }} </span>
              </label>

              <div>
                <WpButton type="filled-primary" size="sm" @click="recruitmentApply()">지원하기</WpButton>
              </div>
            </div>
            <div v-else class="flex items-center gap-1 cursor-pointer" @click="isParticipantsManageModal = !isParticipantsManageModal">
              <img src="/img/icons/person-setting.svg" />
              <label class="text-p2-font-size text-gray-50 cursor-pointer">참여자 관리</label>
            </div>
          </div>

          <!-- 직군 선택 content container -->
          <div class="bg-neutral-container-secondary h-full mt-4 p-3">
            <p class="text-label2-font-size text-gray-70">모집 직군</p>

            <!-- job and recruitAmount container flex-wrap -->
            <div class="flex pt-1 gap-x-4 flex-wrap gap-y-4 md:flex-nowrap md:gap-y-0">
              <div
                v-for="projectJobParticipant in recruitmentPostData.projectJobParticipants"
                :key="projectJobParticipant.job"
                @click="selectProjectJobParticipant(projectJobParticipant)"
                class="flex items-center justify-center border border-outline rounded cursor-pointer h-[54px] w-[99px] md:w-full"
                :class="{
                  '!border-on-primary-container border-[2px] ': currentProjectJobParticipant?.job === projectJobParticipant.job
                }"
              >
                <div class="flex flex-col justify-center items-center pt-1 cursor-pointer">
                  <label class="text-p1-font-size font-medium cursor-pointer">{{ projectJobParticipant.job }}</label>
                  <div class="flex text-p2-font-size gap-[2px]">
                    <label class="text-gray-50 cursor-pointer">{{ projectJobParticipant.participantAmount }}</label>
                    <label class="text-on-primary-container cursor-pointer">/{{ projectJobParticipant.recruitAmount }}</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- divider -->
            <div class="border-t border-outline mt-3"></div>

            <!-- participants container -->
            <div v-if="currentProjectJobParticipant" class="flex flex-col pt-2">
              <!-- 지원자가 있고 모집인원이 1이상일 경우 -->
              <div class="flex flex-col pt-[6px] pb-2" v-if="currentProjectJobParticipant.participants.length && currentProjectJobParticipant.recruitAmount">
                <p class="text-label2-font-size text-neutral-tertiary">참여자</p>

                <div class="flex flex-wrap gap-x-4 gap-y-2 items-center pt-1">
                  <div v-for="participantsItem in currentProjectJobParticipant.participants" :key="participantsItem.memberId">
                    <ParticipantsAvater :participants="participantsItem" />
                  </div>
                </div>
              </div>

              <!-- 지원자가 없고 모집인원이 1이상일 경우 -->
              <div
                class="flex flex-col justify-center items-center gap-x-4"
                v-else-if="!currentProjectJobParticipant.participants.length && currentProjectJobParticipant.recruitAmount"
              >
                <p class="text-neutral-secondary text-p1-font-size font-normal">{{ generateWaitingMessage(currentProjectJobParticipant.job) }}</p>
                <div class="pt-2">
                  <WpButton type="filled-primary" size="sm" @click="recruitmentApply()">지원하기</WpButton>
                </div>
              </div>

              <!-- 모집인원이 0일 경우 -->
              <div class="flex flex-col" v-else></div>
            </div>
          </div>
        </div>

        <!-- 본문 content container -->
        <ClientOnly>
          <WpToastViewer :content="recruitmentPostData.content" />
        </ClientOnly>

        <!-- 기술스택 content container -->
        <div class="flex flex-col">
          <p class="text-h3-font-size">기술스택</p>

          <div class="flex flex-wrap pt-4 gap-3">
            <WpTechStackChip v-for="techName in recruitmentPostData.skills" :key="techName" :techName="techName" :isShowClose="false" />
          </div>
        </div>

        <!-- 작업 진행방식 container -->
        <div calss="flex flex-col">
          <p class="text-h3-font-size">작업 진행방식</p>

          <div class="bg-neutral-container-secondary h-14 flex items-center text-p1-font-size p-4 mt-4">{{ recruitmentPostData.meetingType }}</div>
        </div>

        <!-- 프로젝트 예상 진행기간 container -->
        <div calss="flex flex-col">
          <p class="text-h3-font-size">프로젝트 예상 진행기간</p>

          <div class="bg-neutral-container-secondary h-14 flex items-center text-p1-font-size p-4 mt-4">모집 마감 후 {{ recruitmentPostData.term }}개월</div>
        </div>
      </div>

      <!-- divider -->
      <div class="border-t border-outline mt-10 mb-6"></div>

      <!-- comment(댓글) content container -->
      <div class="flex flex-col">
        <div class="flex items-center gap-3">
          <p class="text-h3-font-size font-medium">댓글</p>
          <p class="text-h3-font-size font-medium text-gray-70">
            {{ recruitmentPostCommentsData?.comments.length === 0 ? 0 : recruitmentPostCommentsData?.comments.length }} 개
          </p>
        </div>

        <div class="flex w-full items-center pt-[16px] gap-x-4">
          <div class="flex flex-grow gap-x-2">
            <WpInput :modelValue="commentInput" @update:model-value="updateCommentInput" :maxlength="300" placeholder="댓글을 남겨주세요" class="h-8 w-full" />
            <!-- self-end를 사용하여 하단 정렬 유지 -->
            <label class="text-label1-font-size text-gray-70 self-end">{{ commentInput.length }}/300</label>
          </div>
          <div class="flex">
            <WpButton type="filled-primary-container" @click="createComments">등록</WpButton>
          </div>
        </div>

        <div class="pt-6" v-if="recruitmentPostCommentsData?.comments">
          <Comment
            v-for="comment in recruitmentPostCommentsData?.comments"
            :key="comment.commentId"
            :commentId="comment.commentId"
            :currentUserName="userName"
            :writerNickName="comment.writerNickname"
            :createdAt="comment.createdAt"
            :content="comment.content"
            :isDeleted="comment.isDeleted"
            @completeCommentAction="recruitmentPostCommentsDataRefresh()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
