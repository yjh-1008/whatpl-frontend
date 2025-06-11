<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';

const isVisible = defineModel({ type: Boolean, default: false });
const myProjects = ref<string[]>();
const myProjectJobs = ref<string[]>([]);
const modalRef = ref<HTMLDivElement>();
const selectProject = ref<string>('');
const selectJob = ref<string>('');
const emits = defineEmits<{
  (e: 'submit', project: string, job: string): void;
}>();
const projectSelect = (e: string) => {
  selectProject.value = e;
};

const jobSelect = (e: string) => {
  selectJob.value = e;
};

onClickOutside(modalRef, () => {
  isVisible.value = false;
});

const submit = () => {
  emits('submit', selectProject.value, selectJob.value);
};
</script>

<template>
  <teleport to="body">
    <!-- base modal container -->
    <div v-if="isVisible" class="flex items-center justify-center w-full h-full bg-modal-dim fixed top-0 left-0 z-[1001]">
      <!-- modal content container -->
      <div ref="modalRef" class="w-[328px] h-[216px] p-6 bg-backround rounded-lg">
        <div class="flex flex-col justify-center items-center gap-y-1">
          <!-- main title -->
          <div class="flex">
            <div class="text-h2-font-size text-neutral font-medium">합류를 제안할까요?</div>
          </div>
        </div>
        <!-- 메인 -->
        <div class="flex flex-col justify-center items-center gap-y-3 mt-3">
          <!-- main title -->
          <!-- <div class="flex"> -->
          <WpDropdown
            :selectList="myProjects"
            :model-value="selectProject"
            @menuSelect="projectSelect"
            class="grow w-full"
            placeholder="프로젝트를 선택하세요"
          />
          <WpDropdown :selectList="myProjectJobs" :model-value="selectJob" @menuSelect="jobSelect" class="grow w-full" placeholder="직무를 선택하세요" />
          <!-- </div> -->
        </div>

        <!-- button -->
        <div class="flex justify-between mt-4">
          <WpButton @click="submit" class="w-full" type="filled-primary">제안하기</WpButton>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style></style>
