<script lang="ts" setup>
interface CommonTitle {
  titleName: string;
  descriptionContent?: string;
  required?: boolean;
  tipContent?: string;
}

const props = withDefaults(defineProps<CommonTitle>(), {
  titleName: '',
  descriptionContent: '',
  required: false,
  tipContent: ''
});
</script>

<template>
  <!-- Title Container -->
  <div class="flex items-center">
    <div class="flex text-h2-font-size font-medium">
      <div>{{ titleName }}</div>
      <div class="flex pb-2 pl-1" v-if="required">
        <img src="/img/icons/required.svg" class="w-[7px] h-4" />
      </div>
    </div>
    <div class="flex text-label2-font-size text-neutral-tertiary pl-3" v-if="descriptionContent && descriptionContent.length">
      {{ descriptionContent }}
    </div>
  </div>
  <!-- Tip -->
  <div class="flex pt-1" v-if="tipContent && tipContent.length">
    <WpTip :content="tipContent" class="w-full" />
  </div>
</template>

<style scoped></style>
