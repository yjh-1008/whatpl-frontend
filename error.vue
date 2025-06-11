<script setup lang="ts">
// error.layout은 Nuxt의 기본 전체 에러페이지를 오버라이딩하여 커스텀해서 사용할 수 있도록 제공한다.
// 향후 error Page 디자인 나오면, 반영 예정

import type { NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError;
}>();

const handleError = () => {
  auth().clearUserApplicationCookie();
  clearError({ redirect: '/' });
};
</script>

<template>
  <div>
    <h2>{{ error.statusCode }}</h2>
    <h2>{{ error.message }}</h2>
    <button @click="handleError">Clear errors</button>
  </div>
</template>
