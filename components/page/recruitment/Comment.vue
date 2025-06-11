<script lang="ts" setup>
import WpUserAvater from '@/components/global/WpUserAvater.vue';
import WpConfirmModal from '@/components/global/WpConfirmModal.vue';

const { $get, $patch, $cDelete } = useNuxtApp();
const { handleClientError } = useErrorHandler();

const dayjs = useDayjs();

const props = defineProps<{
  commentId: number;
  currentUserName: string;
  writerNickName: string;
  createdAt: string;
  content: string;
  isDeleted: boolean;
}>();

const emits = defineEmits<{
  (e: 'editMyComment', event1: number, event2: string): void;
  (e: 'completeCommentAction'): void;
}>();

const router = useRouter();
const currentQuery = computed(() => {
  return router.currentRoute.value.query;
});
const { id } = currentQuery.value;

const isEdit = ref(false);
const editCommentContent = ref('');
const showEditInput = () => {
  isEdit.value = true;
  editCommentContent.value = props.content;
};
const updateCommentInput = (commentInputChangeEvent: Event) => {
  const changeValue = (commentInputChangeEvent.target as HTMLInputElement).value;
  editCommentContent.value = changeValue;
};
const editMyComment = async () => {
  try {
    if (!editCommentContent.value) {
      throw '댓글 내용을 입력해주세요!';
    }

    const modalResult = await confirmModalComponentRef.value.confirmModalShow({
      title: '댓글을 수정하시겠습니까?',
      subTitle1: '',
      isCancel: true,
      confirmButtonName: '수정'
    });

    if (!modalResult) {
      return;
    }

    const editCommentsBody = {
      content: editCommentContent.value
    };

    const requestEditComments = await $patch(`/projects/${id}/comments/${props.commentId}`, editCommentsBody);
    const requestEditCommentsStatus = requestEditComments.status;
    const requestEditCommentsResult = requestEditComments._data;

    if (requestEditCommentsStatus !== 204) {
      throw requestEditCommentsResult;
    }

    isEdit.value = false;
    editCommentContent.value = '';
    emits('completeCommentAction');
  } catch (err) {
    handleClientError(err);
  }
};
const deleteMyComment = async () => {
  try {
    const modalResult = await confirmModalComponentRef.value.confirmModalShow({
      title: '댓글을 삭제할까요?',
      subTitle1: '',
      isCancel: true,
      confirmButtonName: '삭제'
    });

    if (!modalResult) {
      return;
    }

    const requestCreateComments = await $cDelete(`/projects/${id}/comments/${props.commentId}`);
    const requestCreateCommentsStatus = requestCreateComments.status;
    const requestCreateCommentsResult = requestCreateComments._data;

    if (requestCreateCommentsStatus !== 204) {
      throw requestCreateCommentsResult;
    }

    emits('completeCommentAction');
  } catch (err) {
    handleClientError(err);
  }
};

// confirm modal
const confirmModalComponentRef = ref();
</script>

<template>
  <div class="flex flex-col w-full pt-4 pb-4">
    <WpConfirmModal ref="confirmModalComponentRef" />

    <div class="flex items-center">
      <WpUserAvater class="w-6 h-6" />

      <div class="flex justify-between items-center pl-2 w-full">
        <div class="flex gap-x-4">
          <div class="text-p1-font-size font-medium">{{ writerNickName }}</div>
          <div class="text-label2-font-size text-gray-70 pt-[2px] pb-[2px]">
            {{ dayjs(createdAt).format('YYYY-MM-DD') }}
          </div>
        </div>

        <div class="flex gap-x-3" v-if="currentUserName === writerNickName && !isDeleted">
          <img src="/img/icons/edit-gray.svg" @click="showEditInput" class="cursor-pointer" />
          <img src="/img/icons/trashcan.svg" @click="deleteMyComment" class="cursor-pointer" />
        </div>
      </div>
    </div>

    <div class="flex pt-3 text-neutral text-p1-font-size" v-if="!isEdit">{{ content }}</div>
    <div class="flex w-full items-center pt-[16px] gap-x-4" v-else>
      <div class="flex flex-grow gap-x-2">
        <WpInput
          :modelValue="editCommentContent"
          @update:model-value="updateCommentInput"
          :maxlength="300"
          placeholder="댓글을 입력해주세요"
          class="h-8 w-full"
        />
        <label class="text-label1-font-size text-gray-70 self-end"> {{ editCommentContent.length }}/300</label>
      </div>

      <div class="flex">
        <WpButton type="filled-primary-container" @click="editMyComment">등록</WpButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
