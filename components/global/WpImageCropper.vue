<script lang="ts" setup>
import Crooper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import WpButton from '@/components/global/WpButton.vue';

const props = defineProps<{
  isVisible: boolean;
  originalImg: string;
}>();

const emits = defineEmits<{
  (e: 'cancel'): void;
  (e: 'save', event1: string, event2: File[]): void;
}>();

const saveCropImage = () => {
  const confirmResult = confirm('선택한 영역의 이미지를 대표이미지로 사용하시겠습니까?');

  if (!confirmResult) {
    return;
  }

  // 선택한 영역을 잘라내어, 새 캔버스를 생성한다.
  const croppedCanvas = cropper.value.getCroppedCanvas();

  // 생성된 캔버스를 dataUrl 형태의 이미지로 추출한다.
  const cropImgConvertDataUrl = croppedCanvas.toDataURL('image/png');

  // toBlob => 캔버스에 포함된 이미지를 Blob 객체로 만들어준다.
  croppedCanvas.toBlob((blob: Blob) => {
    // blob를 File 객체로 컨버팅한다.
    const cropFile = new File([blob], 'representativeImg.png', { type: 'image/png' });

    // validation TEST
    // const cropFile = new File([], 'representativeImg.pngd', { type: 'image/pngd' });

    const newFileArray = [];
    newFileArray.push(cropFile);

    emits('save', cropImgConvertDataUrl, newFileArray);
  });
};

const crooperjsRef = ref();
const cropper = ref();
onMounted(() => {
  cropper.value = new Crooper(crooperjsRef.value, {
    viewMode: 1,
    aspectRatio: 16 / 9
  });
});
</script>

<template>
  <!-- top level container -->
  <div v-if="isVisible" class="flex items-center justify-center w-full h-full bg-modal-dim fixed top-0 left-0 z-[1001]">
    <!-- cropper container  -->
    <div class="flex flex-col bg-backround w-[504px] h-[492px] rounded-lg p-4">
      <!-- modal title -->
      <div class="flex justify-start font-medium text-h3-font-size pb-4">이미지 편집</div>

      <!-- cropper -->
      <div class="flex w-full h-[344px]">
        <img ref="crooperjsRef" :src="originalImg" />
      </div>

      <!-- footer button cotainer -->
      <div class="flex justify-center gap-4 pt-6">
        <WpButton class="w-full" type="filled-primary-container" @click="() => emits('cancel')"> 취소 </WpButton>
        <WpButton class="w-full" @click="saveCropImage"> 저장 </WpButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
