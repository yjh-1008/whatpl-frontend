module.exports = {
  // 프로젝트의 루트 디렉토리에서 .eslintrc.cjs 파일을 찾는다.
  root: true,
  env: {
    // 코드가 실행되는 환경 설정
    browser: true, // 브라우저 환경에서 실행
    node: true // 노드 환경에서 실행
  },
  parser: 'vue-eslint-parser', // Vue.js 코드를 분석할 때 사용할 파서 지정
  parserOptions: {
    parser: '@typescript-eslint/parser', // TypeScript 코드를 파싱하는 데 사용할 파서 지정
    sourceType: 'module' // ECMAScript 모듈 형식으로 코드 작성
  },
  // 사용할 ESLint 플러그인 목록 - Typescript
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  // 사용할 ESLint 확장 구성 목록
  extends: [
    'airbnb-base', // airbnb에서 사용하는 JavaScript 스타일 가이드
    'plugin:prettier/recommended', // Prettier와 ESLint의 충돌을 방지하기 위한 규칙
    'plugin:nuxt/recommended', // Nuxt.js 관련 규칙
    'plugin:vue/vue3-recommended', // Vue.js 관련 규칙
    'plugin:@typescript-eslint/eslint-recommended', // TypeScript ESLint 규칙
    '@nuxtjs/eslint-config-typescript', // Nuxt.js 프로젝트에서 TypeScript와 함께 사용되는 ESLint 규칙
    'prettier'
  ],
  // 사용자 정의 규칙 설정
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'no-await-in-loop': 'off',
    'vue/no-multiple-template-root': 'off',
    'prefer-const': [
      'off',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false
      }
    ],
    'global-require': 'off',
    'vue/valid-template-root': 'off',
    'no-underscore-dangle': 'off',
    'import/newline-after-import': 'off',
    'no-empty': 'off',
    'vue/no-unused-vars': 'off',
    'vue/no-mutating-props': 'off',
    'vue/attributes-order': 'off',
    'vue/v-on-event-hyphenation': 'off',
    'vue/multi-word-component-names': 'off',
    'no-param-reassign': 'off',
    'no-void': 'off',
    'object-shorthand': 'off',
    'no-alert': 'off',
    'no-nested-ternary': 'off',
    'max-classes-per-file': 'off',
    'arrow-body-style': 'off',
    'no-restricted-globals': 'off',
    'no-else-return': 'off',
    'consistent-return': 'off',
    'vue/attribute-hyphenation': 'off',
    'no-lonely-if': 'off',
    'no-throw-literal': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'import/first': 'off',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/named': 'off',
    'prefer-promise-reject-errors': 'off',
    quotes: ['warn', 'single', { avoidEscape: true }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
      }
    ],
    'prefer-template': 'off',
    'prefer-destructuring': 'off',
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'vue/no-setup-props-destructure': 'off',
    'max-len': 'off',
    'no-irregular-whitespace': 'off'
  }
};
