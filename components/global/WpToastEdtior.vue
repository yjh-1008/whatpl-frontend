<script lang="ts" setup>
import Editor from '@toast-ui/editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

type ToastEditorHookCallback = (url: string, text?: string) => void;

const runtimeConfig = useRuntimeConfig().public;
const { backEndBaseUrl } = runtimeConfig;

const props = defineProps<{
  height?: string;
  content: string;
}>();

const editor = ref();
onMounted(() => {
  editor.value = new Editor({
    el: editor.value,
    initialValue: props.content,
    initialEditType: 'wysiwyg', // wysiwyg or markdown
    hideModeSwitch: true,
    language: 'ko-KR',
    autofocus: false,
    height: props.height,
    plugins: [colorSyntax],
    hooks: {
      addImageBlobHook: async (blob: Blob, callback: ToastEditorHookCallback) => {
        try {
          const uploadFile = blob;

          const formData = new FormData();
          formData.append('file', uploadFile);

          // 파일업로드
          const fileUploadResult = await useAttachments().fileUpload(formData);

          // 이미지 조회 url을 생성하여 toastUiEditor의 callback 함수에 넘겨준다.
          if (fileUploadResult && fileUploadResult.attachmentId && typeof fileUploadResult.attachmentId === 'number') {
            const imageUrl = `${backEndBaseUrl}/attachments/${fileUploadResult.attachmentId}/images`;
            callback(imageUrl);
          } else {
            throw fileUploadResult;
          }
        } catch (err) {
          useErrorHandler().triggerError(err);
        }
      }
    }
  });
});

const getEditorContent = () => {
  return editor.value.getHTML();
};
defineExpose({ getEditorContent });
</script>

<template>
  <div ref="editor" class="w-full"></div>
</template>

<style scoped></style>
