export const auth = () => {
  // 유저가 웹 어플리케이션을 사용하는데 있어, 필요한 쿠키를 모두 삭제한다.
  const clearUserApplicationCookie = () => {
    let userAccessTokenCookie = useCookie('userAccessToken', { secure: true, sameSite: 'strict' });
    let userRefreshTokenCookie = useCookie('userRefreshToken', { secure: true, sameSite: 'strict' });
    let currentLoginTypeCookie = useCookie('currentLoginType');
    let userNameCookie = useCookie('userName');
    let userHpfCookie = useCookie('userHpf');
    let userLCookie = useCookie('userL');
    let memberIdCookie = useCookie('memberId');

    userAccessTokenCookie.value = null;
    userRefreshTokenCookie.value = null;
    currentLoginTypeCookie.value = null;
    userNameCookie.value = null;
    userHpfCookie.value = null;
    userLCookie.value = null;
    memberIdCookie.value = null;
  };

  return { clearUserApplicationCookie };
};
