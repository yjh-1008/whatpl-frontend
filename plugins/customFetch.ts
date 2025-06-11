import type { BackEndBaseResponse } from '@/typescript/interface/common';
import type { TokenRefreshResponse } from '@/typescript/interface/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const { backEndBaseUrl } = runtimeConfig.public;

  const { generateNuxtErrorOb } = useErrorHandler();

  const userAccessTokenCookie = useCookie('userAccessToken', { secure: true, sameSite: 'strict' });
  const userRefreshTokenCookie = useCookie('userRefreshToken', { secure: true, sameSite: 'strict' });

  const whatplFetch = $fetch.create({
    baseURL: backEndBaseUrl,
    // error 발생시 자동 요청 횟수 , retry되는 에러코드는 retryStatusCodes에 등록, default => 3
    retry: 1,
    // true로 지정시 ohmyfetch에서 일으키는 에러를 무시하며, onResponseError와 onRequestError를 사용하지 못함
    ignoreResponseError: false,
    // Default => [408, 409, 425, 429, 500, 502, 503, 504]
    // 401은 Default 값에 포함되지 않아서 추가
    retryStatusCodes: [401],
    onRequest({ request, options }) {
      // 토큰 재발급 or 로그인시 accessToken을 headers에 삽입하는 것을 방지
      if (!String(request).includes('/token') && !String(request).includes('/login') && userAccessTokenCookie) {
        options.headers = { Authorization: `Bearer ${userAccessTokenCookie.value}` };
      }
    },
    onRequestError({ request, options, error }) {},
    onResponse({ request, options, response }) {
      // 401 에러가 아닌 경우, 에러 처리를 위해 인터셉터를 우회할 수 있도록 $fetch 옵션을 수정한다.
      if (response.status !== 401) {
        options.ignoreResponseError = true;
      }
    },
    async onResponseError({ request, options, response }) {
      const backendServerErrorResponse: BackEndBaseResponse = response._data;
      const backendServerErrorStatus = response.status;

      if (backendServerErrorResponse) {
        const backendErrorCode = backendServerErrorResponse.code;

        // 백엔드로부터 받은 에러코드에서 숫자만 추출
        const onlyNumberFromErrorCode = extractNumberFromErrorCode(backendServerErrorResponse.code);

        // error code가 TKN2일 경우
        if (backendServerErrorStatus === 401 && backendErrorCode === 'TKN2') {
          const oldRefreshToken = userRefreshTokenCookie.value;

          // failed to get refreshToken(ftgr)
          if (!oldRefreshToken) {
            // throw error
            throw generateNuxtErrorOb(404, '토큰 갱신 중 에러가 발생했습니다::ftgr\n다시 로그인 해주세요.');
          }

          // token refresh (TIP[1] - TKN2(만료된 토큰)일 경우에만 AccessToken 재발급, 나머지는 모두 로그아웃 처리)
          const requestHeaders = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };
          const requestFormData = new URLSearchParams();
          requestFormData.append('refreshToken', oldRefreshToken);

          const requestTokenRefresh = await $fetch.raw<TokenRefreshResponse>('/token', {
            baseURL: backEndBaseUrl,
            headers: requestHeaders,
            body: requestFormData,
            method: 'POST',
            retry: 0,
            ignoreResponseError: true
          });
          const requestTokenRefreshStatus = requestTokenRefresh.status;
          const requestTokenRefreshResult = requestTokenRefresh._data;

          if (requestTokenRefreshStatus === 200 && requestTokenRefreshResult) {
            userAccessTokenCookie.value = requestTokenRefreshResult.accessToken;
            userRefreshTokenCookie.value = requestTokenRefreshResult.refreshToken;
          } else {
            // fail to token refresh(fttr)
            const userL = useCookie('userL');
            userL.value = 'N';
            throw generateNuxtErrorOb(401, '토큰 갱신 중 에러가 발생했습니다::fttr\n다시 로그인 해주세요.');
          }
        } else {
          // Token error not of type TKN2 code(tenotTc)
          throw generateNuxtErrorOb(401, `토큰 갱신 중 에러가 발생했습니다::'tenotTc'${onlyNumberFromErrorCode}\n다시 로그인 해주세요.`);
        }
      } else {
        // internal server error(ise)
        throw generateNuxtErrorOb(500, '죄송합니다. 예기치 못한 오류가 발생했습니다::ise😥\n다시 시도해주세요');
      }
    }
  });

  const get = <T>(url: string, params?: any, headers?: HeadersInit, credentials?: RequestCredentials) => {
    return whatplFetch.raw<T>(url, { method: 'GET', params: params, headers: headers, credentials: credentials });
  };
  const post = <T>(url: string, body: any, headers?: HeadersInit, credentials?: RequestCredentials) => {
    return whatplFetch.raw<T>(url, { method: 'POST', body: body, headers: headers, credentials: credentials });
  };
  const patch = <T>(url: string, body: any, headers?: HeadersInit, credentials?: RequestCredentials) => {
    return whatplFetch.raw<T>(url, { method: 'PATCH', body: body, headers: headers, credentials: credentials });
  };
  const put = <T>(url: string, body: any, headers?: HeadersInit, credentials?: RequestCredentials) => {
    return whatplFetch.raw<T>(url, { method: 'PUT', body: body, headers: headers, credentials: credentials });
  };
  const cDelete = <T>(url: string, headers?: HeadersInit, credentials?: RequestCredentials) => {
    return whatplFetch.raw<T>(url, { method: 'DELETE', headers: headers, credentials: credentials });
  };

  return {
    provide: { get, post, patch, put, cDelete }
  };
});
