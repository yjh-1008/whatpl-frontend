<script lang="ts" setup>
const props = defineProps<{
  applyType: 'APPLY' | 'OFFER';
}>();

const computedChipMessage = computed(() => {
  let message = '';

  // 타 유저가 모집자에게 합류 요청한 경우
  if (props.applyType === 'APPLY') {
    message = '합류요청';
  }
  // 모집자가 타 유저에게 합류 제안한 경우
  else {
    message = '합류제안';
  }

  return message;
});

// #AF52DE29 = > 요청

// 00C7BE29 = > 제안
</script>

<template>
  <div
    class="flex rounded-full bg-[#00C7BE29] w-[58px] h-5 items-center font-medium text-label2-font-size justify-center"
    :class="applyType === 'APPLY' ? 'bg-[#AF52DE29] text-[#AF52DE]' : 'bg-[#00C7BE29] text-[#00C7BE]'"
  >
    {{ computedChipMessage }}
  </div>
</template>

<style scoped></style>
