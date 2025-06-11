import type { BackEndBaseResponse } from '@/typescript/interface/common';

// 소셜로그인
interface SocialLoginResponse extends BackEndBaseResponse {
  accessToken: string;
  refreshToken: string;
}

// AccessToken 재발급
interface TokenRefreshResponse extends BackEndBaseResponse {
  accessToken: string;
  refreshToken: string;
}

export type { SocialLoginResponse, TokenRefreshResponse };
