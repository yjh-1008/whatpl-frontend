<script lang="ts" setup>
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const props = defineProps<{
  content: string;
}>();

const viewer = ref();
onMounted(() => {
  viewer.value = Editor.factory({
    el: viewer.value,
    viewer: true,
    initialValue: props.content,
    language: 'ko-KR'
  });
});
</script>

<template>
  <div ref="viewer" class="w-full"></div>
</template>

<style scoped></style>
