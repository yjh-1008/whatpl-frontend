<script lang="ts" setup>
const isVisible = ref(false);

const toggleVisibility = () => {
  isVisible.value = !isVisible.value;
};

defineExpose({ toggleVisibility });
</script>

<template>
  <teleport to="body">
    <!-- base modal container -->
    <div v-if="isVisible" class="flex items-center justify-center w-full h-full bg-modal-dim fixed top-0 left-0 z-[1001]">
      <!-- modal content container -->
      <div class="w-[328px] p-6 bg-backround rounded-lg">
        <div class="flex flex-col justify-center items-center gap-y-1">
          <!-- main title -->
          <div class="flex">
            <div class="text-h2-font-size text-neutral font-medium">
              <slot name="title"> </slot>
            </div>
          </div>

          <!-- sub title1 -->
          <div class="text-p1-font-size text-neutral-secondary">
            <slot name="subTitle1"></slot>
          </div>

          <!-- sub title2 -->
          <div class="text-p1-font-size text-neutral-secondary">
            <slot name="subTitle2"></slot>
          </div>
        </div>

        <!-- button -->
        <div class="flex justify-between pt-4 gap-x-4">
          <slot name="button"></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped></style>
