import type { BackEndBaseResponse } from '@/typescript/interface/common';

// 파일업로드
interface FileUploadResponse extends BackEndBaseResponse {
  attachmentId: number;
}

export type { FileUploadResponse };
