<script lang="ts" setup>
import WpButton from '@/components/global/WpButton.vue';
import ParticipantsAvater from '@/components/page/recruitment/ParticipantsAvater.vue';
import WpConfirmModal from '@/components/global/WpConfirmModal.vue';
import type { ParticipantsItem, RecruitmentPostProjectJobParticipantItem } from '@/typescript/interface/recruitment';

const { $cDelete } = useNuxtApp();
const { handleClientError } = useErrorHandler();

const props = defineProps<{
  isVisible: boolean;
  projectId: string;
  projectJobParticipants: RecruitmentPostProjectJobParticipantItem[];
}>();

const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'completeKickoutParticipantAction'): void;
}>();

const jobs = ref(props.projectJobParticipants.map(({ job }) => job));
const currentSelectJobs = ref('');
const jobBoxDynamicClass = (job: string) => {
  if (currentSelectJobs.value === job) {
    return 'flex h-11 w-full justify-center p-3 text-on-primary-container font-medium text-p2-font-size cursor-pointer bg-primary-container';
  } else {
    return 'flex h-11 w-full justify-center p-3 text-neutral-tertiary text-p2-font-size cursor-pointer';
  }
};

// 현재 선택된 직군에 참여한 모집인원 계산
const calcProjectJobParticipants = computed(() => {
  if (currentSelectJobs.value) {
    const calcData = props.projectJobParticipants.filter((el) => el.job === currentSelectJobs.value)[0].participants;
    return calcData;
  } else {
    return [];
  }
});

const closeParticipantsManageModal = () => {
  currentSelectJobs.value = '';
  emits('close');
};

// confirm modal
const confirmModalComponentRef = ref();

// 프로젝트에 참여한 모집자를 내보낸다.
const kickoutParticipant = async (participantsItem: ParticipantsItem) => {
  try {
    const modalResult = await confirmModalComponentRef.value.confirmModalShow({
      title: `${participantsItem.nickname}님을 내보낼까요?`,
      subTitle1: '',
      isCancel: true,
      confirmButtonName: '내보내기'
    });

    if (!modalResult) {
      return;
    }

    const requestKickoutParticipant = await $cDelete(`/projects/${props.projectId}/participants/${participantsItem.participantId}`);
    const requestKickoutParticipantStatus = requestKickoutParticipant.status;
    const requestKickoutParticipantResult = requestKickoutParticipant._data;

    if (requestKickoutParticipantStatus !== 204) {
      throw requestKickoutParticipantResult;
    }

    emits('completeKickoutParticipantAction');
  } catch (err) {
    handleClientError(err);
  }
};
</script>

<template>
  <div v-if="isVisible" class="flex items-center justify-center w-full h-full bg-modal-dim fixed top-0 left-0 z-[1001]">
    <!-- Confirm Modal -->
    <WpConfirmModal ref="confirmModalComponentRef" />

    <div class="flex flex-col w-[504px] h-[364px] bg-backround rounded">
      <!-- header -->
      <div class="flex w-full items-center justify-between p-4">
        <p class="text-h3-font-size font-medium">모집현황</p>

        <img src="/img/icons/close.svg" class="w-5 h-5 cursor-pointer" @click="closeParticipantsManageModal" />
      </div>

      <!-- content -->
      <div class="flex flex-row border-t border-outline w-full h-full">
        <!-- jobs -->
        <div class="flex flex-col w-[98px] h-full border-r border-outline-secondary">
          <div v-for="job in jobs" :key="job" :class="jobBoxDynamicClass(job)" @click="currentSelectJobs = job">
            {{ job }}
          </div>
        </div>

        <!-- Participants -->
        <div class="flex flex-col p-2 grow h-full">
          <!-- 참여자가 있을 경우-->
          <div v-if="calcProjectJobParticipants.length">
            <div class="flex h-[52px] py-3 px-4" v-for="calcProjectJobParticipant in calcProjectJobParticipants" :key="calcProjectJobParticipant.memberId">
              <div class="flex w-full items-center justify-between">
                <div class="flex">
                  <ParticipantsAvater :participants="calcProjectJobParticipant" :currentSelectJob="currentSelectJobs" />
                </div>
                <div class="flex">
                  <WpButton type="outlined-outline" size="xs" @click="kickoutParticipant(calcProjectJobParticipant)"> 내보내기 </WpButton>
                </div>
              </div>
            </div>
          </div>

          <!-- 참여자가 없을 경우 -->
          <div class="flex w-full h-full items-center justify-center" v-else>
            <p class="text-neutral-tertiary text-label1-font-size">아직 참여자가 없어요</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
