export const useModal = () => {
  const confirmModalContent = ref({ title: '', subTitle1: '', subTitle2: '', isCancel: false, confirmButtonName: '' });
  const setConfirmModalContent = (content: { title: string; subTitle1: string; subTitle2: string; isCancel: boolean; confirmButtonName: string }) => {
    confirmModalContent.value = { ...content };
  };
  const clearConfirmModalContent = () => {
    confirmModalContent.value = { title: '', subTitle1: '', subTitle2: '', isCancel: false, confirmButtonName: '' };
  };

  return {
    confirmModalContent,
    setConfirmModalContent,
    clearConfirmModalContent
  };
};
