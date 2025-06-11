import type { NuxtError } from '#app';
import type { BackEndBaseResponse } from '@/typescript/interface/common';

/*
 * 인자로 받은 err 객체가 nuxtError인지 확인한다. (is 키워드를 사용한 타입 가드)
 */
export const isCustomNuxtError = (err: any): err is NuxtError => {
  if ('statusCode' in err && 'message' in err) {
    return true;
  } else {
    return false;
  }
};

/**
 * 인자로 받은 err 객체가 backend(spring)로부터의 약속된 에러 응답인지 확인한다. (is 키워드를 사용한 타입 가드)
 */
export const isBackendError = (err: any): err is BackEndBaseResponse => {
  if ('status' in err && 'code' in err && 'message' in err) {
    return true;
  } else {
    return false;
  }
};
