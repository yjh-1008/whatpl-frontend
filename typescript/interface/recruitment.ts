import type { BackEndBaseResponse, PageResponse } from '@/typescript/interface/common';

interface JobAndRecruitAmountItem {
  job: string;
  recruitAmount: number;
}

// 모집글 댓글 리스트
interface RecruitmentPostComments extends BackEndBaseResponse {
  projectId: number;
  comments: {
    commentId: number;
    writerId: number;
    writerNickname: string;
    content: string;
    createdAt: string;
    isModified: boolean;
    isDeleted: boolean;
    subComments?: {
      commentId: number;
      writerId: number;
      writerNickname: string;
      content: string;
      createdAt: string;
      isModified: boolean;
      isDeleted: boolean;
      parentId: number;
    }[];
  }[];
}

// 모집글 참여자 아이템
interface ParticipantsItem {
  job: string;
  participantId: number;
  memberId: number;
  nickname: string;
  career: string;
}

// 모집글 참여자 데이터 아이템
interface RecruitmentPostProjectJobParticipantItem {
  job: string;
  participantAmount: number;
  participants: ParticipantsItem[];
  recruitAmount: number;
  remainedAmount?: number;
}

// 모집글 데이터
interface RecruitmentPost extends BackEndBaseResponse {
  content: string;
  createdAt: string;
  likes: number;
  meetingType: string;
  myLike: boolean;
  profitable: boolean;
  projectId: number;
  representImageId: number;
  projectJobParticipants: RecruitmentPostProjectJobParticipantItem[];
  skills: string[];
  subject: string;
  term: number;
  title: string;
  views: number;
  writerNickname: string;
  comments: RecruitmentPostComments;
  isWrittenByMe: boolean; // only frontend
}

// 모집글 참여제안 or 지원요청
interface RecriutmentApplyOrOffer extends BackEndBaseResponse {
  applyId: number;
  projectId: number;
  chatRoomId: number;
}

// 메인화면 프로젝트 정보 모집 직군 데이터
interface RecruitmentNoticeProjectJobItem {
  job: string;
  remainedAmount: number;
  recruitAmount: number;
}

// 메인화면 프로젝트
interface RecruitmentNotice extends BackEndBaseResponse {
  remainedJobs: RecruitmentNoticeProjectJobItem[] | RecruitmentPostProjectJobParticipantItem[];
  likes: number;
  myLike: boolean;
  profitable: boolean;
  projectId: number;
  representImageUri: string;
  skills: string[];
  subject: string;
  title: string;
  views: number;
  status: string;
  comments?: RecruitmentPostComments;
  participatedAt?: string;
}

interface RecruitmentPostList extends BackEndBaseResponse, PageResponse {
  list: RecruitmentNotice[];
}
export type {
  JobAndRecruitAmountItem,
  ParticipantsItem,
  RecruitmentPostProjectJobParticipantItem,
  RecruitmentPostComments,
  RecruitmentPost,
  RecriutmentApplyOrOffer,
  RecruitmentPostList,
  RecruitmentNotice,
  RecruitmentNoticeProjectJobItem
};
