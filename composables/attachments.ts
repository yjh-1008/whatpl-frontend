import type { FileUploadResponse } from '@/typescript/interface/attachments';

export const useAttachments = () => {
  const { $post } = useNuxtApp();

  /**
   * 파일업로드 후 attachmentId를 리턴한다.
   */
  const fileUpload = async (body: any) => {
    const attachmentsUploadResult = await $post<FileUploadResponse>('/attachments', body);
    const attachmentsUploadResultData = attachmentsUploadResult._data;
    const attachmentsUploadResultStatus = attachmentsUploadResult.status;

    // 파일 업로드 성공
    if (attachmentsUploadResultStatus === 201 && attachmentsUploadResultData) {
      const attachmentId = attachmentsUploadResultData.attachmentId;

      return { attachmentId };
    }
    // 파일 업로드 실패시 에러 객체 return
    else {
      return attachmentsUploadResultData;
    }
  };

  return { fileUpload };
};
