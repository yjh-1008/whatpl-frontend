// PS : 토큰 에러를 제외한 나머지 에러들은 해당 에러를 throw한다.
// PS : 호출한 곳에서 리턴 받은 에러들을 이용해 triggerError를 통해 메세지를 보여주고 후속 로직을 처리한다.

export const useErrorHandler = () => {
  /*
   * throw하기 위한 nuxtError를 생성하여 리턴한다.
   */
  const generateNuxtErrorOb = (statusCode: number, message: string) => {
    return { statusCode: statusCode, message: message };
  };
  /*
   * client측 Error를 핸들링한다.
   */
  const handleClientError = <T>(err: T) => {
    if (typeof err === 'string') {
      alert(err);
    } else if (isBackendError(err)) {
      alert(err.message);
    } else {
      alert('Blank Err Message');
    }
  };
  /*
   * server측 Error를 핸들링한다. => useAsyncData를 사용하는 곳에서 error.value와 함께 사용
   */
  const handleServerError = <T>(err: T) => {
    if (isCustomNuxtError(err)) {
      throw showError({ fatal: true, statusCode: err.statusCode, message: err.message });
    }
  };

  const member = (responseStatus: number, code: string, message: string) => {};
  const project = (responseStatus: number, code: string, message: string) => {};
  const apply = (responseStatus: number, code: string, message: string) => {};
  const file = (responseStatus: number, code: string, message: string) => {};
  const common = (responseStatus: number, code: string, message: string) => {};
  const domain = (responseStatus: number, code: string, messag: string) => {};

  return { generateNuxtErrorOb, handleClientError, handleServerError };
};
