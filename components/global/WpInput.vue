<script lang="ts" setup>
const props = defineProps<{
  modelValue?: any;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  maxlength?: number;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', event1: Event): void;
  (e: 'onKeyDownEnter'): void;
}>();
</script>

<template>
  <input
    :value="modelValue"
    :maxlength="props.maxlength"
    @input="(e: Event) => emits('update:modelValue', e)"
    @keydown.enter="emits('onKeyDownEnter')"
    :placeholder="placeholder"
    :disabled="disabled"
    :type="type"
    class="border border-outline pt-[6px] pr-3 pb-[6px] pl-3 placeholder:text-p2-font-size placeholder:text-neutral-tertiary rounded focus:outline-on-primary-container focus:outline"
  />
</template>

<style scoped></style>
