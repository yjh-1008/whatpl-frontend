<script lang="ts" setup>
import WpProfitableBadge from '@/components/global/WpProfitableBadge.vue';
import type { RecruitmentNotice, RecruitmentPost } from '@/typescript/interface/recruitment';
import LinkItem from '../signup/LinkItem.vue';
const props = defineProps<{
  project: RecruitmentNotice;
}>();
</script>

<template>
  <div class="flex flex-col h-full w-[296px] p-3 border border-outline-secondary bg-backround">
    <div class="flex">
      <img :src="project.representImageUri" class="w-full h-[99px]" />
    </div>

    <div class="flex items-center gap-2 pt-4">
      <div class="text-p2-font-size text-neutral-secondary">[{{ project.subject }}]</div>
      <WpProfitableBadge />
    </div>

    <div class="flex pt-1 font-medium text-p1-font-size">{{ project.title }}</div>

    <div class="flex flex-col pt-2 gap-y-1">
      <div class="flex gap-2">
        <div class="text-label1-font-size text-neutral-secondary">참여직군</div>
        <div class="text-label1-font-size">{{ project.remainedJobs.map((item) => item.job).join(',') }}</div>
      </div>

      <div class="flex gap-2">
        <div class="text-label1-font-size text-neutral-secondary">합류일자</div>
        <div class="text-label1-font-size">{{ project.participatedAt }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
