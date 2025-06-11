<script lang="ts" setup>
interface WpTipProps {
  content: string;
}

const props = withDefaults(defineProps<WpTipProps>(), {
  content: ''
});
</script>

<template>
  <div class="flex rounded bg-neutral-container">
    <div class="flex items-center p-2">
      <!-- icon container-->
      <div class="flex items-center">
        <div class="flex">
          <img src="/img/icons/information.svg" />
        </div>

        <div class="text-label2-font-size font-medium pl-1 text-neutral-secondary">TIP</div>
      </div>

      <!-- content container -->
      <div class="text-label2-font-size font-medium text-gray-50 pl-3">
        {{ props.content }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
