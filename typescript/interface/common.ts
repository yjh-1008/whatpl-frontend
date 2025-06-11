// 백엔드 공통 에러
interface BackEndBaseResponse {
  code: string;
  message: string;
  status: string;
}

// 응답 결과에 아무런 데이터가 없을 경우의 공통 타입
interface BackEndResponseWithoutContent extends BackEndBaseResponse {}

interface PageResponse {
  currentPage?: number;
  empty?: boolean;
  first?: boolean;
  last?: boolean;
  pageSize?: number;
}

interface GlobalDomainsResponse extends BackEndBaseResponse {
  careers: string[];
  jobs: string[];
  skills: string[];
  subjects: string[];
  workTimes: string[];
  applyStatuses: string[];
}

export type { BackEndBaseResponse, BackEndResponseWithoutContent, PageResponse, GlobalDomainsResponse };
