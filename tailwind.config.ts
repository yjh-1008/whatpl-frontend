import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const scrollbarHide = plugin(function scrollbarhide({ addUtilities }) {
  addUtilities({
    '.scrollbar-hide': {
      /* IE and Edge */
      '-ms-overflow-style': 'none',

      /* Firefox */
      'scrollbar-width': 'none',

      /* Safari and Chrome */
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    }
  });
});
const numberInputArrowHide = plugin(function numberInputArrowHide({ addUtilities }) {
  addUtilities({
    /* Chrome, Safari, Edge, Opera */
    '.number-input-arrow-hide': {
      '&::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: '0'
      },
      '&::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: '0'
      }
    }
  });
});

export default <Partial<Config>>{
  content: ['./components/**/*.{js,vue,ts}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './app.vue', './error.vue'],
  theme: {
    extend: {
      colors: {
        /* Color Palette - Gray */
        'gray-100': '#FFFFFF',
        'gray-98': '#FAFAFA',
        'gray-95': '#F2F2F2',
        'gray-90': '#E3E3E3',
        'gray-80': '#CCCCCC',
        'gray-70': '#ABABAB',
        'gray-60': '#999999',
        'gray-50': '#7D7D7D',
        'gray-40': '#666666',
        'gray-30': '#525252',
        'gray-20': '#383838',
        'gray-10': '#292929',
        'gray-5': '#111111',
        /* Color Palette - Green */
        'green-100': '#FFFFFF',
        'green-98': '#FDFFF5',
        'green-95': '#FAFFE5',
        'green-90': '#F4FFC7',
        'green-80': '#EBFF99',
        'green-70': '#DDFF57',
        'green-60': '#D1FF1A',
        'green-50': '#C4F500',
        'green-40': '#A3CC00',
        'green-30': '#83A300',
        'green-20': '#5A7000',
        'green-10': '#415200',
        'green-5': '#141A00',

        /* System Color */
        primary: '#C4F500',
        'primary-container': '#EBFF99',
        'primary-container-secondary': '#FAFFE5',
        'on-primary-container': '#83A300',
        neutral: '#111111',
        'on-neutral': '#FFFFFF',
        'neutral-secondary': '#666666',
        'neutral-tertiary': '#AAAAAA',
        backround: '#FFFFFF',
        'neutral-container': '#F2F2F2',
        'neutral-container-secondary': '#FAFAFA',
        outline: '#CCCCCC',
        'outline-secondary': '#E3E3E3',
        error: '#FF4531',
        success: '#3478F6',

        /* Others */
        'modal-dim': '#11111180',
        'top-btn': '#ABABAB'
      },
      backgroundImage: {
        'pdf-icon': "url('/public/img/icons/pdf.svg')",
        'image-icon': "url('/public/img/icons/image.svg')",
        kakao: "url('/public/img/icons/카카오.svg')",
        naver: "url('/public/img/icons/네이버.svg')",
        google: "url('/public/img/icons/구글.svg')",
        github: "url('/public/img/icons/깃헙.svg')",
        close: "url('/public/img/icons/close.svg')"
      },
      fontSize: {
        'h1-font-size': '20px',
        'h2-font-size': '18px',
        'h3-font-size': '16px',
        'p1-font-size': '15px',
        'p2-font-size': '14px',
        'label1-font-size': '13px',
        'label2-font-size': '12px'
      },
      lineHeight: {
        'h1-line-height': '24px',
        'h2-line-height': '24px',
        'h3-line-height': '24px',
        'p1-line-height': '24px',
        'p2-line-height': '20px',
        'label1-line-height': '20px',
        'label2-line-height': '20px'
      },
      boxShadow: {
        'simple-my-page-box-shadow': '1px 0px 6px rgba(0, 0, 0, 0.12)',
        'recuritment-post-edit-or-delete-popup-box-shadow': '1px 2px 4px rgba(0, 0, 0, 0.12)',
        'brief-my-page-box-shadow': '1px 0px 6px rgba(0, 0, 0, 0.12)',
        'domain-filter-box-shadow': '2px 4px 4px 0px rgba(0,0,0,0.12)'
      },
      margin: {
        'mx-auto': 'margin-left:auto; margin-right: auto;'
      },
      width: {
        'w-screen': '100vw',
        'w-922': '922px'
      },
      height: {
        'h-screen': '100vh',
        'h-23': '5.75rem'
      }
    }
  },
  plugins: [scrollbarHide, numberInputArrowHide]
};
