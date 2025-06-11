<script lang="ts" setup>
import type { ChatMessageListItem, ChatRoomListItem } from '@/typescript/interface/chat.ts';
import WpUserAvater from '@/components/global/WpUserAvater.vue';

const dayjs = useDayjs();

const props = defineProps<{
  applyType: 'APPLY' | 'OFFER';
  isSenderMe: boolean;
  chatMessageListItem: ChatMessageListItem;
  selectChatRoomItem: ChatRoomListItem;
}>();

const messageSendTime = computed(() => {
  return dayjs(props.chatMessageListItem.sendAt).format('HH:mm');
});
</script>

<template>
  <div class="flex bg-backround p-4 rounded-[12px]">
    <!-- 합류 요청일 때 -->
    <div v-if="applyType === 'APPLY'" class="flex">
      <!-- 내가 보냈을 때 -->
      <div v-if="isSenderMe" class="flex flex-col"></div>
      <!-- 상대방이 보냈을 때 -->
      <div v-else class="flex gap-x-4 max-w-[395px] max-h-[219px]">
        <div class="flex">
          <WpUserAvater class="h-12 w-12" />
        </div>
        <div class="flex flex-col max-w-[299px]">
          <div class="flex justify-between items-center pb-1">
            <div class="flex text-p1-font-size font-medium">
              {{ chatMessageListItem.senderNickname }}
            </div>

            <div class="flex text-p2-font-size text-neutral-tertiary">{{ messageSendTime }}</div>
          </div>
          <div class="flex text-p1-font-size flex-col whitespace-pre-wrap">
            {{ '안녕하세요. [프로젝트명]의 (직군명)에 지원하게 된\n(n)년차 (직군명) (닉네임)입니다.\n프로젝트에 참여하고 싶어서 지원하게 되었습니다 😊' }}
          </div>
          <NuxtLink :to="`/users/${selectChatRoomItem.opponentId}/info`">
            <div class="flex mt-4 h-12 rounded border border-outline-secondary bg-neutral-container-secondary px-4 py-3 cursor-pointer">
              <div class="flex items-center w-full">
                <div class="flex pr-3">
                  <WpUserAvater class="h-6 w-6" />
                </div>

                <div class="flex box-border items-center p-0 gap-1 h-5">
                  <div class="block max-w-[74px] text-p2-font-size text-neutral-secondary font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                    일이삼사오육칠팔
                  </div>
                  <div class="flex text-label1-font-size text-neutral-secondary w-[57px]">프론트엔드</div>
                  <div class="w-3 h-0 bg-neutral-tertiary border border-outline-secondary rotate-90" />
                  <div class="flex text-label1-font-size text-neutral-secondary w-[56px]">5년차 이상</div>
                </div>
              </div>

              <div class="flex items-center">
                <img src="/img/icons/chevron-right.svg" class="w-4 h-4" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
    <!-- 합류 제안일 때 -->
    <div class="flex flex-col" v-if="applyType === 'APPLY'">
      <!-- 내가 보냈을 때 -->
      <div class="flex flex-col" v-if="isSenderMe"></div>
      <!-- 상대방이 보냈을 때 -->
      <div class="flex flex-col"></div>
    </div>
  </div>
</template>

<style scoped></style>
