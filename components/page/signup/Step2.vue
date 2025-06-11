<script lang="ts" setup>
import SectionLabel from '@/components/page/signup/SectionLabel.vue';
import WpDropZone from '@/components/global/WpDropzone.vue';
import UserPortfolio from '@/components/page/signup/UserPortfolio.vue';
import LinkItem from '@/components/page/signup/LinkItem.vue';
import MaxCountLabel from '@/components/page/signup/MaxCountLabel.vue';
import ConfirmModal from '@/components/global/WpConfirmModal.vue';
interface Domains {
  careers: string[];
  jobs: string[];
  skills: string[];
  subjects: string[];
  workTimes: string[];
  applyStatuses: string[];
}
const { $post } = useNuxtApp();
const props = withDefaults(
  defineProps<{
    domainData: Domains;
  }>(),
  {
    domainData: () => {
      return {
        careers: [],
        jobs: [],
        skills: [],
        subjects: [],
        workTimes: [],
        applyStatuses: []
      };
    }
  }
);
const workTime = ref<string>('');
const footerBorderState = ref<boolean>(false);
const portfolios = ref<File[]>([]);
const onMenuSelect = (item: string) => {
  workTime.value = item;
};
const userLinks = ref<string[]>([]);
const userCategory = ref<string[]>([]);
const link = ref<string>('');
const onDelete = (index: number) => {
  portfolios.value.splice(index, 1);
};

const chkLink = async (): Promise<boolean> => {
  const find = userLinks.value.find((item: string) => {
    return item === link.value;
  });
  if (typeof find === 'string') {
    await confirmModalComponentRef.value.confirmModalShow({
      title: '이미 존재하는 URL입니다.',
      subTitle1: '',
      isCancel: false,
      confirmButtonName: '확인'
    });
    return true;
  }

  if (!link.value.includes('http')) {
    await confirmModalComponentRef.value.confirmModalShow({
      title: '올바른 URL을 입력해주세요.',
      subTitle1: '',
      isCancel: false,
      confirmButtonName: '확인'
    });
    return true;
  }

  return false;
};

const registerLink = async () => {
  if (await chkLink()) {
    link.value = '';
    return;
  }
  userLinks.value.push(link.value);
  link.value = '';
};

const deleteLink = (idx: number) => {
  userLinks.value.splice(idx, 1);
};

const updateLinkValue = (e: Event) => {
  const target = e.target as HTMLInputElement;
  link.value = target.value;
};

const onCategorySelect = (idx: number) => {
  if (userCategory.value.includes(idx.toString())) {
    const findIndex = userCategory.value.findIndex((item: string) => item === idx.toString());
    userCategory.value.splice(findIndex, 1);
  } else {
    userCategory.value.push(idx.toString());
  }
};
const getBody = () => {
  const formData = new FormData();

  const subjects = userCategory.value.map((item: string) => {
    return props.domainData.subjects[Number(item)];
  });
  const jsonData = { subjects: subjects, references: userLinks.value, workTime: workTime.value };
  const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
  formData.append('info', blob);
  for (const file of portfolios.value) {
    formData.append('portfolios', file);
  }
  return formData;
};
const router = useRouter();

const registerOptionalData = async () => {
  const body = getBody();
  const response = await $post<any>('/members/optional', body);
  if (response.status === 204) {
    router.push('/');
  } else {
    let subTitle = '';
    if (response._data?.detailErrors) {
      subTitle = response._data?.detailErrors[0].reason;
    }
    await confirmModalComponentRef.value.confirmModalShow({
      title: response._data?.message as string,
      subTitle1: subTitle,
      isCancel: false,
      confirmButtonName: '확인'
    });
  }
};

const confirmModalComponentRef = ref();

const getRepresentativeImgFromDropzone = async (files: File[]) => {
  if (portfolios.value.length === 5) {
    await confirmModalComponentRef.value.confirmModalShow({
      title: '포트폴리오는 최대 5개까지 등록할 수 있어요',
      subTitle1: '',
      isCancel: false,
      confirmButtonName: '확인'
    });
  }

  const fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  let chkFileType = true;
  files.forEach((file: File) => {
    if (chkFileType !== false) {
      if (!fileTypes.includes(file.type)) {
        chkFileType = false;
      }
    }
  });

  if (chkFileType) {
    portfolios.value.push(...files);
  } else {
    await confirmModalComponentRef.value.confirmModalShow({
      title: '지원하는 파일 형식이 아니에요',
      subTitle1: 'pdf, png, jpg, jpeg 파일로 첨부해주세요',
      isCancel: false,
      confirmButtonName: '확인'
    });
  }
};
</script>

<template>
  <div class="w-full flex flex-col" @scroll="() => (footerBorderState = true)">
    <div class="w-[544px] mx-auto mt-[40px] font-semibold flex flex-col gap-y-4">
      <div class="text-h1-font-size">관심있는 프로젝트를 추천해드리기 위해 세부 정보를 입력해주세요</div>

      <div class="flex border-t pt-6 items-center">
        <span>관심있는 카테고리</span>
        <SectionLabel>최대 6개까지 등록할 수 있어요</SectionLabel>
        <MaxCountLabel class="ml-auto" :total="6" :cur="userCategory.length" />
      </div>
      <div class="flex flex-wrap gap-4 w-full">
        <template v-for="(subject, idx) in domainData?.subjects" :key="subject">
          <WpChip
            @click="onCategorySelect(idx)"
            class="h-8"
            :class="userCategory.includes(idx.toString()) ? 'bg-primary-container' : 'bg-neutral-container-secondary'"
            ><div class="p1-font-size font-medium">{{ subject }}</div></WpChip
          >
        </template>
      </div>
      <div>
        <div class="flex items-center mb-4">
          <div class="text-h1-font-size">작업 투자 가능 시간</div>
          <SectionLabel>작업시간은 주간 기준으로 설정해주세요.</SectionLabel>
        </div>
        <WpDropdown
          v-model="workTime"
          :select-list="domainData?.workTimes"
          @menu-select="onMenuSelect"
          placeholder="선택"
          class="font-regular text-neutral-tertiary"
        />
      </div>
      <div>
        <div class="flex items-center mb-4">
          <div class="text-h1-font-size">포트폴리오</div>
          <SectionLabel>최대 5개까지 등록할 수 있어요.(등록 가능 파일: pdf, png, jpg, jpeg)</SectionLabel>
        </div>
        <WpDropZone class="border w-full" :modelValue="portfolios" :is-icon="false" @update:modelValue="getRepresentativeImgFromDropzone">
          <template #description>
            <div>파일을 드래그 하거나 버튼을 클릭하여 첨부해보세요</div>
          </template>
        </WpDropZone>
        <div class="flex gap-2 mt-2">
          <UserPortfolio class="cursor-pointer" v-for="(file, index) in portfolios" :key="file.name" :file="file" @on-delete="onDelete(index)" />
        </div>
      </div>
      <div>
        <div class="flex items-center">
          <div class="text-h1-font-size">기타 링크</div>
          <SectionLabel>최대 5개까지 등록할 수 있어요.</SectionLabel>
        </div>
        <div class="flex gap-4 mt-4">
          <WpInput
            :model-value="link"
            @update:model-value="updateLinkValue"
            class="h-8 grow"
            placeholder="http://"
            tyle="text"
            @on-key-down-enter="registerLink"
          ></WpInput>
          <WpButton size="sm" type="filled-neutral-tertiary" @click="registerLink"><div>등록</div></WpButton>
        </div>
        <LinkItem v-for="(userlink, idx) in userLinks" :key="userlink" @onDelete="deleteLink(idx)" :value="userlink" />
      </div>
    </div>
  </div>
  <ClientOnly>
    <Teleport to="#sign-footer">
      <div class="w-[544px] h-full mx-auto flex flex-col items-center justify-center pt-6 pb-8">
        <WpButton class="w-full" type="filled-primary" @click="registerOptionalData">완료</WpButton>
        <NuxtLink to="/">
          <div class="text- text-p2-font-size mt-3 text-neutral-tertiary">건너뛰기</div>
        </NuxtLink>
      </div>
    </Teleport>
    <Teleport to="body">
      <ConfirmModal ref="confirmModalComponentRef" />
    </Teleport>
  </ClientOnly>
</template>

<style></style>
