import type { SocialLoginResponse } from '@/typescript/interface/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $get } = useNuxtApp();

  let userAccessTokenCookie = useCookie('userAccessToken');
  let userRefreshTokenCookie = useCookie('userRefreshToken');
  let currentLoginTypeCookie = useCookie('currentLoginType');
  let userNameCookie = useCookie('userName');
  let userHpfCookie = useCookie('userHpf');
  let userLCookie = useCookie('userL');
  let memberIdCookie = useCookie('memberId');
  let userCarCookie = useCookie('userCar');
  let userJobCookie = useCookie('userJob');
  const { socialType } = to.params;
  const { code, state, scope, authuser, prompt } = to.query;

  let socialLoginQuery = '';

  if (socialType === 'naver' || socialType === 'kakao') {
    socialLoginQuery = `?code=${code}&state=${state}`;
  }
  // google
  else {
    socialLoginQuery = `?code=${code}&state=${state}&scope=${scope}&authuser=${authuser}&prompt=${prompt}`;
  }

  try {
    const getToken = await $get<SocialLoginResponse>(`/login/oauth2/code/${socialType}${socialLoginQuery}`, undefined, undefined, 'include');
    const getTokenResponseStatus = getToken.status;
    const getTokenResponseData = getToken._data;

    // 토큰 요청 성공
    if (getTokenResponseStatus === 200 && getTokenResponseData) {
      const { accessToken, refreshToken } = getTokenResponseData;

      const { nick, hpf, iss, exp, sub, car, job } = decodeToken(accessToken);
      // AccessToken, RefreshToken 쿠키 저장
      if (accessToken && refreshToken) {
        userAccessTokenCookie = useCookie('userAccessToken', {
          maxAge: 1209600,
          secure: true,
          sameSite: 'strict'
        });
        userAccessTokenCookie.value = accessToken;

        userRefreshTokenCookie = useCookie('userRefreshToken', {
          maxAge: 1209600,
          secure: true,
          sameSite: 'strict'
        });

        userRefreshTokenCookie.value = refreshToken;
      }
      // 사용자가 로그인 시도한 소셜타입 쿠키 저장
      if (socialType) {
        // current social login Type Set (2 WEEK)
        currentLoginTypeCookie = useCookie('currentLoginType', {
          maxAge: 1209600,
          secure: true,
          sameSite: 'strict'
        });
        currentLoginTypeCookie.value = String(socialType);
      }
      // 사용자 이름 쿠키 저장
      if (nick) {
        // userName Set (2 WEEK)
        userNameCookie = useCookie('userName', {
          maxAge: 1209600,
          secure: true,
          sameSite: 'strict'
        });
        userNameCookie.value = nick;
      }
      // profile 저장 유무 쿠키 저장
      let setHpf = '';

      if (hpf === true) {
        setHpf = 'Y';
      } else {
        setHpf = 'N';
      }
      // user profile 작성 유무 쿠키 저장 (2 WEEK);
      userHpfCookie = useCookie('userHpf', {
        maxAge: 1209600,
        secure: true,
        sameSite: 'strict'
      });
      userHpfCookie.value = String(setHpf);

      // memberId 쿠키 저장
      if (sub) {
        memberIdCookie = useCookie('memberId', {
          maxAge: 1209600,
          secure: true,
          sameSite: 'strict'
        });
        memberIdCookie.value = String(sub);
      }

      if (car) {
        userCarCookie = useCookie('userJob', {
          maxAge: 1209600,
          secure: false,
          sameSite: 'strict'
        });
        userCarCookie.value = String(car);
      }

      if (job) {
        userJobCookie = useCookie('userCar', {
          maxAge: 1209600,
          secure: false,
          sameSite: 'strict'
        });
        userJobCookie.value = String(job);
      }

      // 유저 로그인 상태 체크를 위한 쿠키 저장
      userLCookie = useCookie('userL', {
        maxAge: 1209600,
        secure: true,
        sameSite: 'strict'
      });
      userLCookie.value = 'Y';

      // 루트 페이지로 이동
      return navigateTo('/', { replace: true });
    }
  } catch (err) {
    alert(err);
    auth().clearUserApplicationCookie();
    return navigateTo('/', { replace: true });
  }
});
