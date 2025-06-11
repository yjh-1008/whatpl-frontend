import type { BackEndBaseResponse } from './common';

const Job = {
  기획자: 'PLANNER',
  'UX/UI 디자이너': 'DESIGNER',
  '웹 개발자': 'WEB_DEVELOPER',
  '백엔드 개발자': 'MOBILE_DEVELOPER',
  'DevOps 개발자': 'DEVOPS_DEVELOPER',
  '데이터 사이언티스트': 'DATA_SIENTIST'
} as const;

interface UserDefaultInfo {
  nickname: string;
  job: string;
  career: string;
  skills: string[];
  profileOpen: boolean;
}
export interface UserInfo {
  nickname: string;
  job?: string;
  career?: string;
  skills?: string[];
  myInfo?: string;
  profileOpen?: boolean;
  workTime?: string;
  links?: string[];
  categories?: string[];
  subjects?: string[];
  portfolioUrls?: string[];
  references?: string[];
}

export interface GlobalUserInfo extends BackEndBaseResponse, UserInfo {}
