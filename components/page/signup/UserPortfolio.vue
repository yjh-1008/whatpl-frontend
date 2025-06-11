<script lang="ts" setup>
const emits = defineEmits(['onDelete']);
const props = defineProps<{
  file: File;
}>();

const isPdf = computed<boolean>(() => props.file.type.split('/')[1] === 'pdf');
</script>

<template>
  <div class="w-[102px] h-[92px] flex flex-col">
    <div class="w-[102px] h-full grow-0 relative bg-no-repeat bg-center bg-neutral-tertiary" :class="isPdf ? ' bg-pdf-icon' : 'bg-image-icon'">
      <div class="flex justify-between pt-[2px] px-2">
        <div class="text-label2-font-size text-white">{{ file.name.split('.').at(-1) }}</div>
        <img src="/img/icons/close_white.svg" class="w-3" @click="emits('onDelete')" />
      </div>
    </div>
    <div class="text-label2-font-size w-full truncate text-neutral-tertiary font-normal">{{ file.name }}</div>
  </div>
</template>

<style></style>
