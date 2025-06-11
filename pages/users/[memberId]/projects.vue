<script lang="ts" setup>
import WpChip from '@/components/global/WpChip.vue';
import ProjectItem from '@/components/page/users/ProjectItem.vue';
import type { RecruitmentNotice } from '@/typescript/interface/recruitment';
const { $get } = useNuxtApp();
const route = useRoute();
definePageMeta({
  layout: 'users'
});
interface ParticipantProjects {
  recruitedProjectt: RecruitmentNotice[];
}
// interface LikeProjects {

// }
const filterChipList = ref(['내 프로젝트', '관심 프로젝트']);
const filterName = ref('내 프로젝트');
const clickFilterChip = (filterChipName: string) => {
  filterName.value = filterChipName;
};
const { data: myProjects } = await useAsyncData('myProjects', async () => {
  const response = await $get(`/members/${route.params.memberId}/projects/recruited`);
  const data = response._data as ParticipantProjects;
  return data.recruitedProjectt ?? [];
});
const myLikeProjects = ref<RecruitmentNotice[]>([]);
const filterProject = computed(() => {
  return filterName.value === '내 프로젝트' ? myProjects.value : myLikeProjects.value;
});
</script>

<template>
  <div class="flex flex-col pt-6">
    <!-- filter -->
    <div class="flex pt-3 gap-3">
      <WpChip
        v-for="filterChipName in filterChipList"
        :key="filterChipName"
        class="h-8 text-p1-font-size"
        :class="{ 'bg-primary-container-secondary text-on-primary-container font-medium !border-on-primary-container': filterName === filterChipName }"
        @click="clickFilterChip(filterChipName)"
      >
        {{ filterChipName }}</WpChip
      >
    </div>

    <!-- 프로젝트 아이템 컨테이너  -->
    <div class="flex flex-col w-full pt-6">
      <p class="text-h3-font-size font-medium">{{ filterName }}</p>

      <div class="flex flex-wrap pt-2 gap-4">
        <ClientOnly>
          <NuxtLink v-for="(project, index) in filterProject" :key="index" :to="{ path: '/recruitment/view', query: { id: project.projectId } }">
            <ProjectItem :project="project" />
          </NuxtLink>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
