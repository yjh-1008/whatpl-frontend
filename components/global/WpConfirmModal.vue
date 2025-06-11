<script lang="ts" setup>
import BaseModal from '~/components/global/base/BaseModal.vue';
import WpButton from '@/components/global/WpButton.vue';

const { confirmModalContent, setConfirmModalContent, clearConfirmModalContent } = useModal();

const resolvePromise = ref<((value: unknown) => void) | null>(null);

const baseModalComponentRef = ref();

const confirmModalShow = (content: { title: string; subTitle1: string; subTitle2: string; isCancel: boolean; confirmButtonName: string }) => {
  setConfirmModalContent(content);
  baseModalComponentRef.value.toggleVisibility();
  return new Promise((resolve) => {
    resolvePromise.value = resolve;
  });
};

const asyncCancel = () => {
  if (resolvePromise.value) {
    resolvePromise.value(false);
    clearConfirmModalContent();
    baseModalComponentRef.value.toggleVisibility();
  }
};
const asyncConfirm = () => {
  if (resolvePromise.value) {
    resolvePromise.value(true);
    clearConfirmModalContent();
    baseModalComponentRef.value.toggleVisibility();
  }
};

defineExpose({ confirmModalShow });
</script>

<template>
  <BaseModal ref="baseModalComponentRef">
    <template #title>{{ confirmModalContent.title }}</template>

    <template #subTitle1>
      {{ confirmModalContent.subTitle1 }}
    </template>

    <template #subTitle2>
      {{ confirmModalContent.subTitle2 }}
    </template>

    <template #button>
      <WpButton v-if="confirmModalContent.isCancel" type="filled-primary-container" size="lg" class="w-full" @click="asyncCancel">취소</WpButton>
      <WpButton size="lg" class="w-full" @click="asyncConfirm">{{ confirmModalContent.confirmButtonName }}</WpButton>
    </template>
  </BaseModal>
</template>

<style scoped></style>
