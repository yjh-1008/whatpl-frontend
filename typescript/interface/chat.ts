import type { BackEndBaseResponse } from '@/typescript/interface/common';

interface ChatRoomListItem {
  applyType: 'APPLY' | 'OFFER';
  chatRoomId: number;
  lastMessageContent: string;
  lastMessageRead: boolean;
  lastMessageTime: string;
  opponentId: number;
  opponentNickname: string;
  opponentProfileImgUri: string | null;
  projectId: number;
  projectTitle: string;
}

interface ChatRoomItem extends BackEndBaseResponse {
  currentPage: number;
  empty: boolean;
  first: boolean;
  last: boolean;
  list: ChatRoomListItem[];
}

interface ChatMessageListItem {
  messageId: number;
  content: string;
  senderId: number;
  senderNickname: string;
  senderProfileImgUri: null | string;
  sendAt: string;
  readAt: string;
}

interface ChatMessageItem extends BackEndBaseResponse {
  currentPage: number;
  pageSize: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  list: ChatMessageListItem[];
}

export type { ChatRoomListItem, ChatRoomItem, ChatMessageListItem, ChatMessageItem };
