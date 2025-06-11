<script lang="ts" setup>
import WpUserAvater from '@/components/global/WpUserAvater.vue';
import WpButton from '@/components/global/WpButton.vue';
import WpInput from '@/components/global/WpInput.vue';
import WpConfirmModal from '@/components/global/WpConfirmModal.vue';
import type { BackEndResponseWithoutContent } from '@/typescript/interface/common.ts';
import type { ChatRoomListItem, ChatRoomItem, ChatMessageListItem, ChatMessageItem } from '@/typescript/interface/chat.ts';
import { useInfiniteScroll } from '@vueuse/core';
import RoomItem from '@/components/page/chat/RoomItem.vue';
import ApplyTypeChip from '@/components/page/chat/ApplyTypeChip.vue';
import GeneralMessageItem from '@/components/page/chat/GeneralMessageItem.vue';

const dayjs = useDayjs();

const { generateNuxtErrorOb, handleClientError, handleServerError } = useErrorHandler();

const { $get, $post } = useNuxtApp();

const router = useRouter();
const currentQuery = computed(() => {
  return router.currentRoute.value.query;
});
const chatRoomIdInQuery = computed(() => {
  return currentQuery.value.chatRoomId;
});
const isChatRoomIdInQuery = computed(() => {
  if (chatRoomIdInQuery.value) {
    return true;
  } else {
    return false;
  }
});

// confirm modal
const confirmModalComponentRef = ref();

// 휴지통 클릭시 채팅창을 삭제할 수 있도록 체크박스의 visibility를 컨트롤하기 위한 flag
const isChatRoomDeleteMode = ref(false);
const deleteChatRoomItemList = ref<ChatRoomListItem[]>([]);
const changeChatRoomListDeleteMode = async (flag: boolean) => {
  if (flag === false) {
    if (!deleteChatRoomItemList.value.length) {
      isChatRoomDeleteMode.value = false;
    } else {
      const modalResult = await confirmModalComponentRef.value.confirmModalShow({
        title: '쪽지를 삭제할까요?',
        isCancel: true,
        confirmButtonName: '삭제'
      });

      if (!modalResult) {
        return;
      }

      // 1. 채팅방 삭제 로직 시작
      deleteChatRoomItemList.value = [];
      isChatRoomDeleteMode.value = false;
    }
  } else {
    deleteChatRoomItemList.value = [];
    isChatRoomDeleteMode.value = true;
  }
};
const checkChatRoomItem = (calcDeleteRoomItemList: ChatRoomListItem[]) => {
  deleteChatRoomItemList.value = [...calcDeleteRoomItemList];
};

// 합류하기
const requestToJoin = async () => {
  console.log('합류 요청 로직 시작');

  // 합류 요청 성공시 아래 모달 발생
  const modalResult = await confirmModalComponentRef.value.confirmModalShow({
    title: '합류를 요청했어요',
    subTitle1: '[신발 발매 정보 플랫폼 ios 모집]',
    subTitle2: '직무: 프론트엔드',
    isCancel: false,
    confirmButtonName: '확인'
  });
};

const message = ref('');
const updateMessage = (messageChangeEvent: Event) => {
  const changeValue = (messageChangeEvent.target as HTMLInputElement).value;
  message.value = changeValue;
};

// 메세지 전송
const sendMessage = async () => {
  const sendMessageParams = {
    chatRoomId: chatRoomIdInQuery.value,
    content: message.value
  };

  const sendMessageResult = await $post<BackEndResponseWithoutContent>(`/chat/rooms/${chatRoomIdInQuery.value}/messages`, sendMessageParams);
  const sendMessageResultStatus = sendMessageResult.status;
  const sendMessageResultData = sendMessageResult._data;

  if (sendMessageResultStatus === 204) {
    chatMessageListRefresh();
    message.value = '';
  } else {
    handleClientError(sendMessageResultData);
  }

  console.log(sendMessageResult);
};

// 채팅방 리스트 조회를 위한 page
const chatRoomListSearchPage = ref(1);
// 채팅방 리스트 조회를 위한 size
const chatRoomListSearchSize = ref(10);
// 채팅방 리스트 인피니티 스크롤 위한 Ref
const chatRoomListElementRef = ref<HTMLElement | null>(null);
// 채팅방 리스트 조회(left)
const { data: chatRoomList, refresh: chatRoomListRefresh } = await useAsyncData(
  async () => {
    const chatRoomListParams = {
      page: chatRoomListSearchPage.value,
      size: chatRoomListSearchSize.value
    };

    const loadChatRoomsList = await $get<ChatRoomItem>('/chat/rooms', chatRoomListParams);
    const loadChatRoomsListStatus = loadChatRoomsList.status;
    const loadChatRoomsListResult = loadChatRoomsList._data;

    if (loadChatRoomsListStatus === 200 && loadChatRoomsListResult) {
      return loadChatRoomsListResult;
    } else {
      handleClientError(loadChatRoomsListResult!.message);
    }
  },
  { server: false }
);

// 채팅방 리스트 아이템 클릭
const clickChatRoomItem = async (roomItem: ChatRoomListItem) => {
  // 삭제모드시 쿼리 설정 방지
  if (isChatRoomDeleteMode.value) {
    return;
  }
  await navigateTo({ path: '/chat', query: { chatRoomId: roomItem.chatRoomId } });
};
// 현재 선택된 채팅방 리스트 아이템
const selectChatRoomItem = computed<ChatRoomListItem | null>(() => {
  if (chatRoomIdInQuery.value && chatRoomList.value && chatRoomList.value.list.length) {
    const roomItem = chatRoomList.value.list.find((item) => item.chatRoomId === Number(chatRoomIdInQuery.value));
    return roomItem || null;
  } else {
    return null;
  }
});

// 채팅 리스트 조회를 위한 page
const chatMessageListSearchPage = ref(1);
// 채팅 리스트 조회를 위한 size
const chatMessageListSearchSize = ref(10);
// 채팅 리스트 인피니티 스크롤 위한 Ref
const chatMessageListElementRef = ref<HTMLElement | null>(null);
// 채팅리스트 (대화내용) 조회(right)
const { data: chatMessageList, refresh: chatMessageListRefresh } = await useAsyncData(
  async () => {
    // watch에 걸어둔 chatRoomIdInQuery로 인해, 모집글 보기시에 재조회되며 에러가 발생함. 이를 위해 chatRoomIdInQuery가 존재할때만 조회하기위한 조건문
    if (chatRoomIdInQuery.value) {
      const chatMessageListParams = {
        page: chatRoomListSearchPage.value,
        size: chatRoomListSearchSize.value
      };

      const loadChatMessageList = await $get<ChatMessageItem>(`/chat/rooms/${chatRoomIdInQuery.value}/messages`, chatMessageListParams);
      const loadChatMessageListStatus = loadChatMessageList.status;
      const loadChatMessageListResult = loadChatMessageList._data;

      if (loadChatMessageListStatus === 200 && loadChatMessageListResult) {
        return loadChatMessageListResult;
      } else {
        handleClientError(loadChatMessageListResult!.message);
      }
    }
  },
  { server: false, watch: [chatRoomIdInQuery] }
);
</script>

<template>
  <!-- Confirm Modal -->
  <WpConfirmModal ref="confirmModalComponentRef" />

  <!-- top level outer container -->
  <div class="flex flex-row w-full h-[calc(100vh-78px)]">
    <!-- chat list container -->
    <div class="flex flex-col shrink-0 w-[495px] overflow-y-auto h-full">
      <!-- header -->
      <div class="flex flex-row items-center justify-between w-full px-6 pt-4">
        <div class="flex">
          <p class="text-h3-font-size font-medium text-neutral">쪽지 리스트</p>
        </div>
        <div class="flex">
          <img v-if="!isChatRoomDeleteMode" src="/img/icons/trashcan.svg" class="cursor-pointer" @click="changeChatRoomListDeleteMode(true)" />
          <p
            v-if="isChatRoomDeleteMode"
            class="cursor-pointer text-p1-font-size text-on-primary-container font-medium"
            @click="changeChatRoomListDeleteMode(false)"
          >
            삭제
          </p>
        </div>
      </div>

      <!-- chat list container -->
      <div v-if="chatRoomList" class="flex flex-col items-center pt-2 h-full">
        <!-- chat room list container -->
        <div class="flex flex-row w-full items-center" v-for="roomItem in chatRoomList.list" :key="roomItem.chatRoomId">
          <!--  room list item -->
          <RoomItem
            :chatRoomListItem="roomItem"
            :selectChatRoomItem="selectChatRoomItem"
            :isChatRoomDeleteMode="isChatRoomDeleteMode"
            :deleteChatRoomItemList="deleteChatRoomItemList"
            @click="clickChatRoomItem(roomItem)"
            @checkChatRoomItem="checkChatRoomItem"
          />
        </div>
      </div>
    </div>

    <!-- chatMessageList container -->
    <div class="flex flex-col w-full h-full bg-neutral-container-secondary">
      <!-- 아무런 채팅방도 클릭하지 않았을 때 -->
      <div class="flex w-full h-full items-center justify-center" v-if="!isChatRoomIdInQuery">
        <p class="text-label1-font-size text-neutral-tertiary">쪽지리스트를 선택해서 대화를 시작해보세요</p>
      </div>

      <div class="flex flex-col w-full min-h-full" v-if="isChatRoomIdInQuery && selectChatRoomItem">
        <!-- header(합류하기 버튼, 메세지 상대방 프로필이미지, 상대방 닉네임 등 표시 - ps : 상단 고정) -->
        <div class="flex flex-col w-full">
          <div class="flex justify-between items-center w-full p-6 border-b border-outline-secondary">
            <div class="flex flex-col gap-3">
              <p class="text-p2-font-size text-neutral-secondary">[{{ selectChatRoomItem.projectTitle }}]</p>
              <div class="flex items-center gap-2">
                <WpUserAvater class="w-6 h-6" />
                <p class="text-h3-font-size font-medium text-neutral">{{ selectChatRoomItem.opponentNickname }}</p>
                <ApplyTypeChip :applyType="selectChatRoomItem.applyType" />
              </div>
            </div>

            <div class="flex">
              <WpButton size="lg" @click="requestToJoin"> 합류하기 </WpButton>
            </div>
          </div>

          <div class="flex justify-between items-center bg-backround px-6 py-4">
            <p class="text-p2-font-size font-medium text-neutral-secondary">이 프로젝트에 대한 자세한 정보는 모집글에서 볼 수 있어요</p>

            <NuxtLink :to="{ path: '/recruitment/view', query: { id: selectChatRoomItem.projectId } }">
              <div class="flex items-center text-p2-font-size font-medium text-neutral-secondary gap-1 cursor-pointer">
                <p>모집글 보기</p>
                <img src="/img/icons/chevron-right.svg" class="w-5 h-5" />
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- body(메세지 영역) -->
        <div class="flex overflow-y-auto h-full">
          <!-- 메세지 컨테이너 -->
          <div class="flex w-full p-4" v-if="chatMessageList">
            <!-- 합류요청 -->
            <div v-if="selectChatRoomItem.applyType === 'APPLY'">
              <div v-for="(messageItem, index) in chatMessageList.list" :key="messageItem.messageId" class="flex py-8">
                <GeneralMessageItem
                  :applyType="selectChatRoomItem.applyType"
                  :chatMessageListItem="messageItem"
                  :selectChatRoomItem="selectChatRoomItem"
                  :chatMessageItemIndex="index"
                />
              </div>
            </div>

            <!-- 합류제안 -->
            <div v-else></div>
          </div>
        </div>

        <!-- footer(메세지 입력창 및 전송 버튼 각종 아이콘) -->
        <div class="flex w-full border-t border-outline-secondary">
          <div class="flex items-center w-full p-6 gap-3">
            <!-- icon -->
            <div class="flex items-center gap-3">
              <img src="/img/icons/image.svg" class="cursor-pointer" />
              <img src="/img/icons/link.svg" class="cursor-pointer" />
            </div>

            <!-- input -->
            <div class="flex flex-grow">
              <WpInput :modelValue="message" @update:modelValue="updateMessage" placeholder="메세지를 보내보세요" class="h-8 w-full" />
            </div>

            <!-- button -->
            <div class="flex">
              <WpButton size="sm" @click="sendMessage"> 전송 </WpButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
