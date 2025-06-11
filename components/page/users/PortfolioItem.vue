<template>
  <div class="w-[102px] h-[90px]">
    <div class="flex w-full h-[72px] rounded-lg bg-neutral-tertiary">
      <img :src="props.fileType === 'img' ? ImgIcon : PDFIcon" class="w-8 h-8 m-auto" />
    </div>
    <div class="flex mt-0.5 w-full items-center">
      <div class="truncate text-neutral-tertiary text-xs font-normal">dvasvjodsavnas</div>
      <img :src="RightIcon" class="w-4-h-4" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ImgIcon from '@/public/img/icons/image.svg';
import PDFIcon from '@/public/img/icons/pdf.svg';
import RightIcon from '@/public/img/icons/chevron-right.svg';

const props = withDefaults(
  defineProps<{
    fileType?: string;
  }>(),
  {
    fileType: 'img'
  }
);
</script>
