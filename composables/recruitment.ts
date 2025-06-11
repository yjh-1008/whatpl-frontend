import type { JobAndRecruitAmountItem, RecriutmentApplyOrOffer } from '@/typescript/interface/recruitment';

export const useRecruitment = () => {
  const { $post, $put } = useNuxtApp();

  /**
   * 모집글을 등록 혹은 수정한다.
   */
  const confirmPosting = async (
    confirmLocation: string,
    title: string,
    subject: string,
    recruitJobs: JobAndRecruitAmountItem[],
    skills: string[],
    content: string,
    profitable: boolean | null,
    meetingType: string,
    term: number,
    representImage: File[],
    projectId?: string
  ) => {
    const toastEditorBlankContent = '<p><br></p>';
    let representImageId: null | number = null;
    let confirmAlertMessage = '';

    let projectsBody: {
      title: string;
      subject: string;
      recruitJobs: JobAndRecruitAmountItem[];
      skills: string[];
      content: string;
      profitable: boolean | null;
      meetingType: string;
      term: number;
      representImageId?: null | number;
    } = {
      title: title,
      subject: subject,
      recruitJobs: recruitJobs,
      skills: skills,
      content: content,
      profitable: profitable,
      meetingType: meetingType,
      term: term,
      representImageId: representImageId
    };

    // 등록 or 수정에 따라 완료된 후 alert 메세지가 상이함
    if (confirmLocation === 'create') {
      confirmAlertMessage = '모집글 등록을 완료했습니다';
    } else {
      confirmAlertMessage = '모집글 수정을 완료했습니다';
    }

    // 프로젝트명 입력 여부 체크 및 글자수 유효성 체크
    if (!title) {
      throw '프로젝트명을 입력해주세요!';
    }
    if (title.length < 3 || title.length > 20) {
      throw '프로젝트명은 3글자 이상, 20글자 이하로 작성할 수 있습니다!';
    }

    // 도메인 선택 여부 체크
    if (!subject) {
      throw '도메인을 선택해주세요!';
    }

    // 직군 및 모집인원 선택 여부 및 유효성 체크
    if (!recruitJobs.length) {
      throw '직군 및 모집인원을 선택해주세요!';
    }

    // 기술스택 선택 여부 및 유효성 체크
    if (!skills.length) {
      throw '기술스택을 선택해주세요!';
    }
    if (skills.length < 1 || skills.length > 15) {
      throw '기술스택은 1개 이상 15개 이하로 선택할 수 있습니다!';
    }

    // 프로젝트 설명 입력 여부 체크
    if (content === toastEditorBlankContent) {
      throw '프로젝트 설명을 입력해주세요!';
    }

    // 프로젝트 목적 선택 여부 체크
    if (profitable === null) {
      throw '프로젝트 목적을 선택해주세요!';
    }

    // 작업방식 선택 여부 체크
    if (!meetingType) {
      throw '작업 방식을 선택해주세요';
    }

    // 작업 예상 기간 입력 여부 체크
    if (!term) {
      throw '작업 예상 기간을 입력해주세요!';
    }

    // 작업 예상 기간이 1개월 미만 30개월 초과 여부 체크
    if (term < 1 || term > 30) {
      throw '작업 예상 기간은 최소 1개월, 최대 30개월까지 입력할 수 있습니다';
    }

    // 대표이미지 id 획득을 위해 useAttachments().fileupload() 호출
    if (representImage.length) {
      const userRepresentImage = representImage[0];

      const formData = new FormData();
      formData.append('file', userRepresentImage);

      const fileUploadResult = await useAttachments().fileUpload(formData);

      if (fileUploadResult && fileUploadResult.attachmentId) {
        representImageId = fileUploadResult.attachmentId;
      } else {
        throw fileUploadResult;
      }
    }
    // 대표이미지를 수정시에 삭제하였거나 입력하지 않았을 경우 대표이미지를 저장하지 않기 위해 body에서 제외
    else {
      delete projectsBody.representImageId;
    }

    projectsBody.title = title;
    projectsBody.subject = subject;
    projectsBody.recruitJobs = recruitJobs;
    projectsBody.skills = skills;
    projectsBody.content = content;
    projectsBody.profitable = profitable;
    projectsBody.meetingType = meetingType;
    projectsBody.term = term;

    if ('representImageId' in projectsBody) {
      projectsBody.representImageId = representImageId;
    }

    // 등록
    if (confirmLocation === 'create') {
      const projectsCreate = await $post('/projects', projectsBody);
      const projectsCreateStatus = projectsCreate.status;
      const projectsCreateData = projectsCreate._data;

      if (projectsCreateStatus === 201) {
        const location = projectsCreate.headers.get('Location');
        if (location) {
          // id 추출
          const extractProjectId = Number(location.replace(/[^0-9]/g, ''));
          alert(confirmAlertMessage);
          return navigateTo({ path: '/recruitment/view', query: { id: extractProjectId } });
        }
      } else {
        throw projectsCreateData;
      }
    }
    // 수정
    else {
      const projectsEdit = await $put(`/projects/${projectId}`, projectsBody);
      const projectsEditStatus = projectsEdit.status;
      const projectsEditData = projectsEdit._data;

      if (projectsEditStatus === 204) {
        alert(confirmAlertMessage);
        return navigateTo({ path: '/recruitment/view', query: { id: projectId } });
      } else {
        throw projectsEditData;
      }
    }
  };

  /**
   * 프로젝트에 지원하거나 참여를 제안한다.
   * TODO : 향후 왓피플이 화면이 완료된다면, apply 와 offer 로직 수정 필요함
   */
  const applyOrOffer = async (type: string, projectId: string | number, applyJob: string) => {
    let applyOrOfferRequestBody: { content: string; applyType: string; applicantId?: null | number; applyJob: string } = {
      content: '',
      applyType: '',
      applicantId: null,
      applyJob: applyJob
    };

    let baseContent = 'hi';

    // type === 'APPLY' (지원)
    // 지원요청에서는 applicantId 프로퍼티가 사용되지 않는다.
    if (type === 'APPLY') {
      baseContent = '안녕하세요. [프로젝트명]의 (직군명)에 지원하게 된\n(n)년차 (직군명) (닉네임)입니다.\n프로젝트에 참여하고 싶어서 지원하게 되었습니다 😊';

      applyOrOfferRequestBody.content = baseContent;
      delete applyOrOfferRequestBody.applicantId;
      applyOrOfferRequestBody.applyType = 'APPLY';
    }

    // type === 'OFFER' (참여 제안)
    if (type === 'OFFER') {
      applyOrOfferRequestBody.applyType = 'OFFER';
    }

    const projectApployOrOffer = await $post<RecriutmentApplyOrOffer>(`/projects/${projectId}/apply`, applyOrOfferRequestBody);
    const projectApployOrOfferStatus = projectApployOrOffer.status;
    const projectApployOrOfferResultData = projectApployOrOffer._data;

    console.log(projectApployOrOffer);

    if (projectApployOrOfferStatus === 200 && projectApployOrOfferResultData) {
      const chatRoomId = projectApployOrOfferResultData.chatRoomId;
      const roomIdToString = String(chatRoomId);

      return navigateTo({ path: '/chat', query: { chatRoomId: roomIdToString } });
    } else {
      throw projectApployOrOfferResultData;
    }
  };

  return { confirmPosting, applyOrOffer };
};
