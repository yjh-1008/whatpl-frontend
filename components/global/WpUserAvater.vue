<script lang="ts" setup>
const props = defineProps<{
  userProfileImgUri?: string;
}>();

const emits = defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <!-- 나중에 유저가 등록한 사진을 넣어줘야함 -->
  <div class="bg-[#d9d9d9] rounded-full cursor-pointer" @click="() => emits('click')"></div>
</template>

<style scoped></style>
