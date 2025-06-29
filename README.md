# 왓플 (WhatPL) - Frontend

> 개발자들이 프로젝트를 모집하고 팀을 구성할 수 있는 협업 플랫폼

## 📖 서비스 소개

왓플(WhatPL)은 개발자들이 사이드 프로젝트나 스터디를 함께할 팀원을 찾고, 협업할 수 있도록 돕는 플랫폼입니다. 다양한 기술 스택과 역할별로 프로젝트 모집글을 작성하고, 관심 있는 프로젝트에 지원하거나 직접 팀원을 모집할 수 있습니다.

### 🎯 주요 기능

- **프로젝트 모집**: 다양한 기술 스택과 역할별 프로젝트 모집글 작성 및 관리
- **실시간 채팅**: 프로젝트 참가자들과 실시간 소통 가능
- **사용자 프로필**: 개발자 포트폴리오 및 기술 스택 관리
- **소셜 로그인**: 구글, 깃헙, 네이버, 카카오 계정으로 간편 로그인
- **기술 스택 필터링**: 관심 있는 기술 스택별로 프로젝트 필터링
- **참가자 관리**: 프로젝트 생성자의 참가자 승인/거절 관리
- **포트폴리오 관리**: 개인 프로젝트 및 경력 관리

## 🛠️ 기술 스택

### Core Framework

- **Nuxt.js 3.11.1** - Vue.js 기반 풀스택 프레임워크
- **Vue.js 3** - 프론트엔드 프레임워크
- **TypeScript** - 정적 타입 언어

### 상태 관리 & 데이터

- **Pinia** - Vue.js 상태 관리 라이브러리
- **VueUse** - Vue.js 컴포저블 유틸리티

### 스타일링 & UI

- **TailwindCSS** - 유틸리티 퍼스트 CSS 프레임워크
- **SCSS** - CSS 전처리기
- **Pretendard** - 웹폰트 (한글 최적화)

### 주요 라이브러리

- **Toast UI Editor** - 마크다운 에디터 (모집글 작성)
- **CropperJS** - 이미지 크롭 기능
- **Swiper** - 터치 슬라이더
- **vue3-dropzone** - 파일 드래그 앤 드롭 업로드
- **dayjs** - 날짜/시간 처리
- **jwt-decode** - JWT 토큰 처리

### 개발 도구

- **ESLint** - 코드 린팅
- **Prettier** - 코드 포매팅
- **Airbnb Style Guide** - 코드 스타일 가이드

## 📁 프로젝트 구조

```
whatpl-frontend/
├── components/          # Vue 컴포넌트
│   ├── global/         # 전역 공통 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트
│   └── page/           # 페이지별 특화 컴포넌트
│       ├── chat/       # 채팅 관련 컴포넌트
│       ├── home/       # 홈페이지 컴포넌트
│       ├── recruitment/ # 모집글 관련 컴포넌트
│       ├── signup/     # 회원가입 컴포넌트
│       └── users/      # 사용자 프로필 컴포넌트
├── pages/              # 페이지 라우팅
│   ├── chat/           # 채팅 페이지
│   ├── recruitment/    # 모집글 페이지
│   ├── users/          # 사용자 페이지
│   └── oauth2/         # 소셜 로그인 콜백
├── layouts/            # 레이아웃 템플릿
├── composables/        # Vue 컴포저블
├── stores/             # Pinia 스토어
├── middleware/         # Nuxt 미들웨어
├── typescript/         # 타입 정의
│   ├── interface/      # 인터페이스
│   └── types/          # 타입 선언
├── utils/              # 유틸리티 함수
├── assets/             # 정적 자산
│   ├── scss/           # SCSS 스타일
│   └── fonts/          # 웹폰트
└── public/             # 공개 정적 파일
    └── img/icons/      # 아이콘 SVG
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm, yarn, pnpm 중 하나

### 설치 및 실행

1. **의존성 설치**

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install
```

2. **개발 서버 실행**

```bash
# 개발 환경
npm run dev

# 프로덕션 환경 테스트
npm run dev:prod
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

3. **프로덕션 빌드**

```bash
# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 🔧 환경 설정

프로젝트는 다음 환경 변수가 필요합니다:

```bash
# .env.dev 또는 .env.prod
NUXT_PUBLIC_BACK_END_BASE_URL=백엔드_API_URL
NUXT_PUBLIC_BACK_END_365_JWT=JWT_토큰_설정
```

## 🎨 디자인 시스템

- **컴포넌트 접두사**: `Wp` (WhatPL)
- **색상 시스템**: TailwindCSS 기본 팔레트 + 커스텀 색상
- **타이포그래피**: Pretendard 폰트 패밀리
- **반응형**: Mobile-first 디자인

## 📱 지원 브라우저

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 기여하기

1. 이 저장소를 Fork 합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/새기능`)
3. 변경사항을 커밋합니다 (`git commit -am '새 기능 추가'`)
4. 브랜치에 Push 합니다 (`git push origin feature/새기능`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

💡 **문의사항이나 버그 리포트는 Issues를 통해 알려주세요!**
