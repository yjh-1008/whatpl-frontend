<script lang="ts" setup>
interface WpButtonProps {
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  type?:
    | 'filled-primary'
    | 'filled-primary-container'
    | 'filled-neutral'
    | 'filled-neutral-tertiary'
    | 'outlined-primary'
    | 'outlined-on-primary-container'
    | 'outlined-neutral'
    | 'outlined-outline';
  disabled?: boolean;
}

const props = withDefaults(defineProps<WpButtonProps>(), {
  size: 'md',
  type: 'filled-primary',
  disabled: false
});

const emits = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

// Button Size 처리
interface ButtonSize {
  [key: string]: string;
}
const buttonSize: ButtonSize = {
  xl: 'h-11 text-[18px] leading-6 pt-[10px] pr-[16px] pb-[10px] pl-[16px]',
  lg: 'h-10 text-[15px] leading-6 pt-[8px] pr-[16px] pb-[8px] pl-[16px]',
  md: 'h-9 text-[15px] leading-6 pt-[6px] pr-[16px] pb-[6px] pl-[16px]',
  sm: 'h-8 text-[14px] leading-5 pt-[6px] pr-[16px] pb-[6px] pl-[16px]',
  xs: 'h-7 text-[14px] leading-5 pt-[4px] pr-[16px] pb-[4px] pl-[16px]'
};
const buttonSizeClass = computed(() => {
  return buttonSize[props.size];
});

// Button Type 처리
interface ButtonType {
  [key: string]: string;
}
const buttonType: ButtonType = {
  'filled-primary': 'text-neutral bg-primary',
  'filled-primary-container': 'text-neutral bg-primary-container',
  'filled-neutral': 'text-on-neutral bg-neutral ',
  'filled-neutral-tertiary': 'text-on-neutral bg-neutral-tertiary',
  'outlined-primary': 'border border-primary',
  'outlined-on-primary-container': 'border border-on-primary-container',
  'outlined-neutral': 'border border-neutral',
  'outlined-outline': 'border border-outline'
};
const buttonTypeClass = computed(() => {
  return buttonType[props.type];
});

// Button Disabled 처리
interface ButtonDisabled {
  [key: string]: string;
}
const buttonDisabled: ButtonDisabled = {
  true: 'disabled:opacity-60',
  false: ''
};
const disabledClass = computed(() => {
  return buttonDisabled[String(props.disabled)];
});

// hover: , active:
const buttonBaseClass = 'font-medium rounded-md';
const buttonClass = `${buttonBaseClass} ${buttonSizeClass.value} ${buttonTypeClass.value}`;
</script>

<template>
  <button :class="[buttonClass, disabledClass]" @click="(e: MouseEvent) => emits('click', e)" :disabled="disabled">
    <slot></slot>
  </button>
</template>
