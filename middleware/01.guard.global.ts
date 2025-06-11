export default defineNuxtRouteMiddleware(async (to, from) => {
  const userHpf = useCookie('userHpf');
  const userName = useCookie('userName');
  // hpf 값이 N이라면, 사용자가 회원가입 절차를 마치지 않았다면 회원가입 창으로 리다이렉트
  if (to.path !== '/signup' && userName.value && userHpf.value === 'N') {
    const isClient = await new Promise((resolve) => {
      if (process.client) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    if (isClient) {
      // 회원가입 페이지에서 완료를 진행하지 않고 벗어나는 경우.
      if (from.path === '/signup') {
        alert('회원가입을 완료해주세요!');
        return abortNavigation();
      } else {
        // 회원가입 상태가 아니고, new User가 true가 아닐 경우.
        // if (localStorage.getItem('newUser') !== 'true') {
        //   localStorage.setItem('newUser', 'true');
        //   alert('회원가입을 완료하지 않았습니다.\n회원가입 페이지로 이동합니다');
        //   return navigateTo('/signup?step=1', { replace: true });
        // }
      }
    }
  } else {
    if (process.client) {
      if (to.path === '/signup' && userHpf.value === 'Y' && userName.value) {
        abortNavigation();
        alert('접근할 수 없는 페이지입니다.');
        return navigateTo('/', { replace: true, external: true });
      }
    }
  }
});
