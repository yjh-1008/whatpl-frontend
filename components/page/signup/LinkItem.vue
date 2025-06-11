<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig();
const { backEndBaseUrl } = runtimeConfig.public;
const emits = defineEmits<{
  (e: 'onDelete'): void;
}>();

const computeImagePath = computed<string>(() => {
  const subject: string = props.value.split('/')[2].split('.')[1];
  return `${backEndBaseUrl}/images/skill/${subject}`;
});
const props = defineProps<{
  value: string;
}>();
</script>

<template>
  <div class="border-b py-2 px-3">
    <div class="flex h-5 gap-2 items-center justify-center">
      <img :src="computeImagePath" class="w-4" />
      <a :href="'http://' + props.value" target="_blank" class="grow text-label1-font-size font-regular">
        {{ props.value }}
      </a>
      <button class="w-2 h-2 bg-close bg-no-repeat bg-center" @click="emits('onDelete')" />
    </div>
  </div>
</template>

<style></style>
