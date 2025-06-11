<script lang="ts" setup>
import type { ParticipantsItem } from '@/typescript/interface/recruitment';

const props = defineProps<{
  participants: ParticipantsItem;
}>();

const generateParticipantCarrer = (job: string) => {
  let ment = '';

  switch (job) {
    case '기획': {
      ment = '기획자';
      break;
    }
    case 'PM': {
      ment = 'PM';
      break;
    }
    case '디자인': {
      ment = '디자이너';
      break;
    }
    case '프론트엔드': {
      ment = '프론트엔드 개발자';
      break;
    }
    case '백엔드': {
      ment = '백엔드 개발자';
      break;
    }
    case 'Andorid': {
      ment = 'Android 개발자';
      break;
    }
    case 'ios': {
      ment = 'ios 개발자';
      break;
    }

    default: {
      break;
    }
  }

  return ment;
};
</script>

<template>
  <div class="flex items-center">
    <WpUserAvater class="w-5 h-5" />
    <div>
      <label class="text-p1-font-size font-medium pl-2">{{ participants.nickname }}</label>
      <label class="text-label2-font-size text-neutral-secondary pl-1">
        {{ participants.career === '취업 준비중' ? participants.career : `${participants.career} ${generateParticipantCarrer(participants.job)}` }}
      </label>
    </div>
  </div>
</template>

<style scoped></style>
