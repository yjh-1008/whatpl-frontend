<script lang="ts" setup>
import ApplyTypeChip from '@/components/page/chat/ApplyTypeChip.vue';
import type { ChatRoomListItem } from '@/typescript/interface/chat.ts';

const props = defineProps<{
  chatRoomListItem: ChatRoomListItem;
  selectChatRoomItem: ChatRoomListItem | null;
  isChatRoomDeleteMode: boolean;
  deleteChatRoomItemList: ChatRoomListItem[];
}>();
const emits = defineEmits<{
  (e: 'checkChatRoomItem', event1: ChatRoomListItem[]): void;
}>();

const dayjs = useDayjs();

// 마지막 보낸 채팅 시간 계산
const computedLastMessageTime = computed(() => {
  let formattedLastMessageTime = '';
  const formattedTime12Hour = dayjs(props.chatRoomListItem.lastMessageTime).format('HH:mm A');
  const formattedTime24Hour = dayjs(props.chatRoomListItem.lastMessageTime).format('HH:mm');
  const formattedTimeYyyyMmDd = dayjs(props.chatRoomListItem.lastMessageTime).format('YYYY-MM-DD');
  let timeIndicator = '';

  if (formattedTime12Hour.includes('AM')) {
    timeIndicator = '오전';
  } else {
    timeIndicator = '오후';
  }

  // 마지막으로 채팅 보낸 시간 및 날짜가 현재 시간을 기준으로 오늘이 아닐 경우 (월요일,화요일 등과 같이 나타내줄 수 있도록 계산)
  const formattedCurrentTimeDayjs = dayjs();
  const formatteddLastMessageTimeDayjs = dayjs(formattedTimeYyyyMmDd);
  const isToDay = formattedCurrentTimeDayjs.isSame(formatteddLastMessageTimeDayjs, 'day');
  const twoDaysLater = dayjs(formattedTimeYyyyMmDd).add(2, 'day');
  const isTwoDaysLater = formatteddLastMessageTimeDayjs.isSame(twoDaysLater, 'day');

  // 마지막으로 채팅 보낸 시간이 오늘이 아닐 경우
  if (!isToDay && !twoDaysLater) {
    formattedLastMessageTime = '어제';
  }
  // 그저께 (이틀이 지났을 경우)
  else if (!isToDay && twoDaysLater) {
    formattedLastMessageTime = formattedTimeYyyyMmDd;
  }
  // 오늘
  else {
    formattedLastMessageTime = `${timeIndicator} ${formattedTime24Hour}`;
  }

  return formattedLastMessageTime;
});

const isSelectChatRoomItem = computed(() => {
  if (props.selectChatRoomItem && props.selectChatRoomItem.chatRoomId === props.chatRoomListItem.chatRoomId) {
    return true;
  } else {
    return false;
  }
});

// 삭제 모드에서 현재 선택된 채팅방 아이템인지 boolean 값으로 리턴해주는 computed 함수
const isSelectedForDelete = computed(() => {
  const findCurrentChatRoomListItem = props.deleteChatRoomItemList.find((item) => item.chatRoomId === props.chatRoomListItem.chatRoomId);

  if (findCurrentChatRoomListItem) {
    return true;
  } else {
    return false;
  }
});

// 삭제 모드에서 삭제하고자 하는 아이템 혹은 이미 선택되어있는 아이템을 클릭했을경우, 연산 후 현재 선택되어 있는 삭제리스트 리턴
const calcDeleteChatRoomItemList = () => {
  let newDeleteChatRoomItemList: ChatRoomListItem[] = [];

  if (!props.deleteChatRoomItemList.length) {
    newDeleteChatRoomItemList.push(props.chatRoomListItem);
  } else {
    let existingDeleteChatRoomItemList = props.deleteChatRoomItemList;

    const findChatRoomItem = existingDeleteChatRoomItemList.findIndex((item) => item.chatRoomId === props.chatRoomListItem.chatRoomId);

    // 기존에 선택되어있지 않았을 경우
    if (findChatRoomItem === -1) {
      existingDeleteChatRoomItemList.push(props.chatRoomListItem);
    }
    // 선택되어있던 아이템을 재선택 했을 경우 (체크 해제)
    else {
      existingDeleteChatRoomItemList.splice(findChatRoomItem, 1);
    }

    newDeleteChatRoomItemList = [...existingDeleteChatRoomItemList];
  }

  emits('checkChatRoomItem', newDeleteChatRoomItemList);
};
</script>

<template>
  <div class="flex w-full items-center hover:bg-[#11111114]" :class="{ '!bg-[#11111114] hover:bg-none': isSelectChatRoomItem }">
    <!-- 채팅방 리스트 삭제 체크박스 -->
    <div
      class="flex w-4 h-4 border-[1.5px] border-neutral-secondary rounded-[1px] ml-6 cursor-pointer"
      :class="{
        'bg-primary !border-primary': isSelectedForDelete
      }"
      v-if="isChatRoomDeleteMode"
      @click="calcDeleteChatRoomItemList"
    >
      <img src="/img/icons/check-primary-container.svg" v-if="isSelectedForDelete" />
    </div>

    <!-- 채팅방 리스트 아이템 -->
    <div class="flex flex-col w-full px-6 cursor-pointer">
      <div class="flex flex-col items-center">
        <div class="flex justify-between items-center w-full pt-4">
          <p class="text-p2-font-size text-neutral-secondary">[{{ chatRoomListItem.projectTitle }}]</p>

          <p class="text-p2-font-size text-neutral-secondary">{{ computedLastMessageTime }}</p>
        </div>

        <div class="flex items-center pt-3 gap-3 w-full border-b border-outline-secondary pb-4">
          <div class="flex">
            <WpUserAvater class="w-[46px] h-[46px]" />
          </div>

          <div class="flex flex-col w-full gap-y-[2px]">
            <div class="flex gap-x-2 items-center">
              <p class="text-h3-font-size text-neutral font-medium">{{ chatRoomListItem.opponentNickname }}</p>
              <ApplyTypeChip :applyType="chatRoomListItem.applyType" />
            </div>

            <div class="flex items-center gap-x-2 w-full">
              <div class="flex flex-grow w-0">
                <p class="text-p1-font-size text-neutral whitespace-nowrap overflow-hidden text-ellipsis">
                  {{ chatRoomListItem.lastMessageContent }}
                </p>
              </div>

              <div class="flex w-2 h-2" v-if="!chatRoomListItem.lastMessageRead">
                <div class="flex w-2 h-2 bg-primary rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
