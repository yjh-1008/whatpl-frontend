<script lang="ts" setup>
import type { ChatMessageListItem, ChatRoomListItem } from '@/typescript/interface/chat.ts';
import WpUserAvater from '@/components/global/WpUserAvater.vue';
import FirstMessageItem from '@/components/page/chat/FirstMessageItem.vue';

const props = defineProps<{
  applyType: 'APPLY' | 'OFFER';
  chatMessageListItem: ChatMessageListItem;
  selectChatRoomItem: ChatRoomListItem;
  chatMessageItemIndex: number;
}>();

const dayjs = useDayjs();

const memeberId = useCookie('memberId');
const userName = useCookie('userName');

const isSenderMe = computed(() => {
  debugger;
  if (memeberId.value && userName.value) {
    if (
      typeof memeberId.value === 'number' &&
      memeberId.value === props.chatMessageListItem.senderId &&
      userName.value === props.chatMessageListItem.senderNickname
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
});
const isFirstMessage = computed(() => {
  if (props.chatMessageItemIndex === 0) {
    return true;
  } else {
    return false;
  }
});

const messageSendTime = computed(() => {
  return dayjs(props.chatMessageListItem.sendAt).format('HH:mm');
});
</script>

<template>
  <!-- 처음 보낸 메세지일 경우 -->
  <FirstMessageItem
    v-if="isFirstMessage"
    :applyType="applyType"
    :isSenderMe="isSenderMe"
    :chatMessageListItem="chatMessageListItem"
    :selectChatRoomItem="selectChatRoomItem"
  />

  <div v-else class="flex">
    <div v-if="isSenderMe" class="flex bg-backround p-4 rounded-[12px]" :class="{ 'h-[84px]': !isSenderMe }">
      <div class="flex flex-col w-full min-w-full max-w-full text-p1-font-size">
        <!-- 내가 보냈을 때 -->
        <div v-if="isSenderMe" class="flex flex-col gap-y-1">
          <div class="flex justify-end text-p2-font-size text-neutral-tertiary">
            {{ messageSendTime }}
          </div>
          <div class="flex">{{ chatMessageListItem.content }}</div>
        </div>

        <!-- 타유저가 보냈을 때 -->
        <!-- <div v-else class="flex items-center gap-x-4">
          <div class="flex">
            <WpUserAvater class="w-12 h-12" />
          </div>
          <div class="flex flex-col gap-y-1">
            <div class="flex items-center gap-x-3">
              <div class="flex text-p1-font-size font-medium">
                {{ chatMessageListItem.senderNickname }}
              </div>
              <div class="flex text-p2-font-size text-neutral-tertiary">
                {{ messageSendTime }}
              </div>
            </div>

            <div class="text-p1-font-size whitespace-pre-wrap">
              {{ chatMessageListItem.content }}
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped></style>
