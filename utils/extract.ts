/*
 * Backend Response Common Error Code에서 문자만 추출하여 리턴한다.
 */
export const extractCharFromErrorCode = (code: string) => {
  return code.replace(/[0-9]/g, '');
};
/*
 * Backend Response Common Error Code에서 숫자만 추출하여 리턴한다.
 */
export const extractNumberFromErrorCode = (code: string) => {
  return Number(code.replace(/[^0-9]/g, ''));
};
