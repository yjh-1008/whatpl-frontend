export default defineNuxtRouteMiddleware((to, from) => {
  const userHpf = useCookie('userHpf');
  let regPrimaryInfoCookie = useCookie('regPrimaryInfo');
  if (process.client) {
    if (userHpf.value !== 'N') {
      abortNavigation();
      alert('접근할 수 없는 페이지입니다.');
      return navigateTo('/', { replace: true, external: true });
    }
    if (from.path !== '/signup' && to.query.step === '1') {
      regPrimaryInfoCookie.value = String(false);
      // regPrimaryInfoCookie.value = null;
    }
    if (from.query.step === '2' && to.query.step === '1') {
      alert('이전 페이지로 이동할 수 없습니다.');
      return abortNavigation();
    }
    const regPrimaryInfo = regPrimaryInfoCookie.value === String(true);
    if (regPrimaryInfoCookie.value && to.query.step === '1') {
      alert('이전 페이지로 이동할 수 없습니다.');
      return navigateTo('/signup?step=2');
    }
  }
});
