<script lang="ts" setup>
import { useDropzone } from 'vue3-dropzone';
import type { FileRejectReason } from 'vue3-dropzone';
import WpButton from '@/components/global/WpButton.vue';

interface WpDropzone {
  modelValue: File[];
  isIcon?: boolean;
}

const props = withDefaults(defineProps<WpDropzone>(), {
  modelValue: () => [],
  isIcon: false
});

const onDrop = (acceptFiles: File[], rejectReasons: FileRejectReason[]) => {
  // 파일이 지정한 양식(사이즈, 확장자 등)을 지키지 않아 reject 되었을 경우
  if (rejectReasons.length !== 0) {
    // errors 프로퍼티가 있는지 체크
    if ('errors' in rejectReasons[0]) {
      // 'FileRejectionError' 타입은 유니온 타입임. code와 message 프로퍼티 사용을 위해 null과 boolean 타입을 가드
      if (typeof rejectReasons[0].errors[0] !== 'boolean' && rejectReasons[0].errors[0] !== null) {
        const message = translationRejectMessage(rejectReasons[0].errors[0].code);
        alert(message);
      }
    }
  } else {
    emits('update:modelValue', acceptFiles);
  }
};

// maxSize는 byte 기준 , 허용할 최대 파일 사이즈는 10mb , 따라서 10 * 1e+6
const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: ['image/jpg', 'image/png', '.pdf'], maxSize: 10000000 });

// reject code를 받아 reject message를 리턴시켜주는 함수
const translationRejectMessage = (rejectCode: string) => {
  let message = '';

  switch (rejectCode) {
    case 'file-invalid-type': {
      message = '파일 확장자가 올바르지 않습니다.';
      break;
    }
    case 'file-too-large': {
      message = '최대 파일 크기를 다시 확인해주세요.';
      break;
    }
    case 'file-too-small': {
      message = '최소 파일 크기를 다시 확인해주세요.';
      break;
    }
    case 'too-many-files': {
      message = '첨부 가능한 파일 갯수를 초과했습니다.';
      break;
    }
    default: {
      break;
    }
  }

  return message;
};

const emits = defineEmits<{
  (e: 'update:modelValue', value: File[]): void;
}>();

// drag 감지 변수
const isDrag = computed(() => {
  return isDragActive.value;
});

// drag 감지 변수를 사용해 drag시 hover css 동적 처리
const dynamicDropzoneCotainerClass = computed(() => {
  if (isDrag.value) {
    return 'flex flex-col justify-center items-center bg-[#141c1c1c] opacity-[8] rounded border border-outline-secondary p-8';
  } else {
    return 'flex flex-col justify-center items-center bg-neutral-container-secondary rounded border border-outline-secondary p-8';
  }
});
</script>

<template>
  <div :class="dynamicDropzoneCotainerClass" v-bind="getRootProps()">
    <input v-bind="getInputProps()" />

    <!-- icon wrapper -->
    <div class="flex" v-if="isIcon">
      <slot name="icon" />
    </div>

    <!-- description wrapper -->
    <div class="flex pt-1 pb-2 text-gray-70 text-label2-font-size">
      <slot name="description" />
    </div>
    <!-- button wrapper -->
    <div class="flex">
      <WpButton :size="'xs'" :type="'filled-neutral-tertiary'"> 사진 업로드 </WpButton>
    </div>
  </div>
</template>

<style scoped></style>
